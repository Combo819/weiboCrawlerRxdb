import { getSubCommentApi } from "../../request";
import { q } from "../queue";
import {
  IComment,
  CommentDocument,
  ISubComment,
  SubCommentDocument,
} from "../../database/collections";
import { database } from "../../database/connect";
import camelcaseKeys from "camelcase-keys";
import { map } from "async";
import { saveUser } from "./saveUser";
/**
 * the params that the func needs in async queue worker
 */
interface SubCommentParams {
  commentDoc: CommentDocument;
  cid: string;
  maxId?: string | undefined;
  maxIdType?: number | undefined;
}

/**
 * starter function that pushes the first sub comment  request of the current comment to the worker of the queue
 * @param commentDoc the parent comment doc of this sub comment
 */
export default function crawlerSubComments(commentDoc: CommentDocument): void {
  const firstSubCommentParams: SubCommentParams = {
    commentDoc,
    cid: commentDoc.get('_id'),
  };
  console.log(
    q.length(),
    "q.length",
    q.running(),
    "q.running",
    "in first crawler sub comment"
  );
  q.push([{ func, params: firstSubCommentParams }]);
}

/**
 * the iteratee for async map function to iterate all sub comments in this batch and save them
 * @param item sub comment item
 * @param callback
 */
const iteratee = (item: any, callback: any) => {
  if(typeof item==='number'){
    throw new Error('item is a number')
  }
  const {
    id,
    mid,
    rootid,
    rootidstr,
    floorNumber,
    text,
    user,
    likeCount,
    createdAt,
  } = item;

  const newSubComment: ISubComment = {
    _id: String(id),
    id:String(id),
    mid,
    rootid,
    rootidstr,
    floorNumber,
    text,
    user: String(user.id) ,
    likeCount,
    createdAt,
  };
  if (!database) {
    return;
  }
  database?.subcomment
    .atomicUpsert(newSubComment)
    .then((res: SubCommentDocument) => {
      const subCommentDoc: SubCommentDocument = res;
      saveUser(user);
      callback();
    })
    .catch((err) => {
      console.log(err);
      callback();
    });
};

/**
 * the function that will be executed in queue worker that fetches the sub comments
 * @param params the information that we need to request the batch of sub comments
 */
function func(params: SubCommentParams): Promise<any> {
  return new Promise((resolve, reject) => {
    const { cid, maxId, maxIdType, commentDoc } = params;
    getSubCommentApi(cid, maxId, maxIdType)
      .then(async (res) => {
        const { data, maxId, maxIdType } = camelcaseKeys(res.data, {
          deep: true,
        });
        if (typeof data !== "object") {
          resolve();
          return;
        }
        await map(data, iteratee);
        const newSubComments: string[] = data.map((item: any) => item.id);

        await commentDoc.update({
          $addToSet: { subComments: { $each: newSubComments } },
        });
        if (Number(maxId) !== 0) {
          console.log(
            q.length(),
            "q.length",
            q.running(),
            "q.running",
            "in 2 or more crawler sub comment"
          );
          q.push([{ func, params: { commentDoc, cid, maxId, maxIdType } }]);
        }
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
