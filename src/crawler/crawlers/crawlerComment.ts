import { getCommentApi,axios } from "../../request";
import { q } from "../queue";
import {
  WeiboDocument,
  IComment,
  CommentDocument,
} from "../../database/collections";
import { database } from "../../database/connect";
import camelcaseKeys from "camelcase-keys";
import crawlerSubComments from "./crawlerSubComment";
import { saveUser } from "./saveUser";
import { map } from "async";
import downloadImage from "../downloader/image";
import { staticPath } from "../../config";

/**
 * the params that the func needs in async queue worker
 */
interface commentParams {
  weiboDoc: WeiboDocument;
  id: string;
  mid?: string | undefined;
  maxId?: string | undefined;
  maxIdType?: number | undefined;
  count?:number;
}

/**
 * starter function that pushes the first comment requesting to the worker of queue
 * @param weiboDoc the weibo document
 * @param weiboId the weibo Id
 */
export default function crawlerComment(
  weiboDoc: WeiboDocument,
  weiboId: string
): void {
  const firstCommentParams: commentParams = {
    weiboDoc,
    id: weiboId,
  };
  //if it's non-cookie mode
  if(!axios.defaults.headers.common['cookie']){
    firstCommentParams['count'] = 200;
  }
  console.log(
    q.length(),
    "q.length",
    q.running(),
    "q.running",
    "in first crawler   comment"
  );
  q.push([{ func, params: firstCommentParams }]);
  q.resume();
}

/**
 * the iteratee for async map function to iterate all comments in this batch and save them
 * @param item comment item
 * @param callback
 */
const iteratee = (item: any, callback: any): void => {
  let {
    id,
    mid,
    rootid,
    rootidstr,
    floorNumber,
    text,
    maxId,
    totalNumber,
    user,
    likeCount,
    createdAt,
    pic,
    weiboId,
  } = item;
  
  const newComment: IComment = {
    _id: id,
    id: String(id),
    mid,
    rootid,
    rootidstr,
    floorNumber,
    text,
    maxId: String(maxId),
    totalNumber,
    user: String(user.id),
    likeCount:Number(likeCount),
    createdAt,
    subComments: [],
    pic,
    weiboId,
  };
  if (!database) {
    return;
  }
  database.comment
    .atomicUpsert(newComment)
    .then((res) => {
      const commentDoc: CommentDocument = res;
      if (pic) {
        downloadImage(pic.large.url, staticPath);
      }
      saveUser(user);
      crawlerSubComments(commentDoc);
      callback();
    })
    .catch((err) => {
      console.log(err,'error in crawlerComments 108');
    });
};

/**
 * the function that will be executed in queue worker that fetches the comments
 * @param params the information that we need to request the batch of comments
 */
const func = (params: commentParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { weiboDoc, id, mid, maxId, maxIdType,count } = params;
    getCommentApi(id, maxId, mid, maxIdType,count)
      .then(async (res) => {
        // console.log(res, "res in getting comment");
        if (!res.data.data) {
          resolve(null);
          return;
        }
        const { data, maxId, maxIdType } = camelcaseKeys(res.data.data, {
          deep: true,
        });
        await map(
          data.map((item: any) => ({ ...item, weiboId: weiboDoc.id })),
          iteratee
        );
        const newComments: string[] = data.map((item: any) => item.id);
        weiboDoc.update({
          $addToSet: {
            comments: { $each: newComments },
          },
        });
        if (Number(maxId) !== 0) {
          console.log(
            q.length(),
            "q.length",
            q.running(),
            "q.running",
            "in 2 or more crawler comment"
          );
          q.push([
            { func: func, params: { weiboDoc, id, mid, maxId, maxIdType } },
          ]);
        }
        resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
