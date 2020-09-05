import { getCommentApi } from "../../request";
import { q } from "../queue";
import { CommentModel, IComment, IWeibo, WeiboModel } from "../../database";
import camelcaseKeys from "camelcase-keys";
import crawlerSubComments from "./crawlerSubComment";
import {saveUser} from './saveUser';
import {map} from 'async'

/**
 * the params that the func needs in async queue worker
 */
interface commentParams {
  weiboDoc: IWeibo;
  id: string;
  mid?: string | undefined;
  maxId?: string | undefined;
  maxIdType?: number | undefined;
}

/**
 * starter function that pushes the first comment requesting to the worker of queue
 * @param weiboDoc the weibo document
 * @param weiboId the weibo Id
 */
export default function crawlerComment(
  weiboDoc: IWeibo,
  weiboId: string
): void {
  const firstCommentParams: commentParams = {
    weiboDoc,
    id: weiboId,
  };
  console.log(q.length(),'q.length',q.running(),'q.running','in first crawler   comment')
  q.push([{ func, params: firstCommentParams }]);
}

/**
 * the iteratee for async map function to iterate all comments in this batch and save them
 * @param item comment item 
 * @param callback 
 */
const iteratee = (item:any,callback:any):void=>{
  const {
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
  } = item;
  const commentDoc: IComment = new CommentModel({
    _id: id,
    id,
    mid,
    rootid,
    rootidstr,
    floorNumber,
    text,
    maxId,
    totalNumber,
    user: user.id,
    likeCount,
    createdAt,
    subComments: [],
  });
  commentDoc.save((err, product) => {
    if (err&&err.code!==11000) {
      console.log(err, "err");
    }
    saveUser(user)
    crawlerSubComments(commentDoc);
    callback();
  });
}

/**
 * the function that will be executed in queue worker that fetches the comments
 * @param params the information that we need to request the batch of comments
 */
const func = (params: commentParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { weiboDoc, id, mid, maxId, maxIdType } = params;
    getCommentApi(id, maxId, mid, maxIdType)
      .then( async (res) => {
        // console.log(res, "res in getting comment");
        if (!res.data.data) {
          resolve();
          return;
        }
        const { data, maxId, maxIdType } = camelcaseKeys(res.data.data, {
          deep: true,
        });
        await map(data,iteratee);
        const newComments: string[] = data.map((item: any) => item.id);
        weiboDoc.comments.addToSet(...newComments);
        weiboDoc.isNew = false;
        weiboDoc.save((err) => {
          if (err&&err.code!==11000) {
            console.log("error in updating weiboDoc" + weiboDoc.id);
          }
        });
        if (Number(maxId) !== 0) {
          console.log(q.length(),'q.length',q.running(),'q.running','in 2 or more crawler comment')
          q.push([
            { func: func, params: { weiboDoc, id, mid, maxId, maxIdType } },
          ]);
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
