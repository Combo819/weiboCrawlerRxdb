import { getSubCommentApi } from "../../request";
import { q } from "../queue";
import { IComment,  CommentDocument, ISubComment, SubCommentDocument } from "../../database/collections";
import {database} from '../../database/connect'
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
    cid: commentDoc.id,
  };
  console.log(q.length(),'q.length',q.running(),'q.running','in first crawler sub comment')
  q.push([{ func, params: firstSubCommentParams }]);
}

/**
 * the iteratee for async map function to iterate all sub comments in this batch and save them
 * @param item sub comment item 
 * @param callback 
 */
const iteratee = (item:any,callback:any)=>{
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
  const newSubComment:ISubComment = {
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
    createdAt
  }
  if(!database){
    return;
  }
   database.subcomment.insert(newSubComment).then((res:SubCommentDocument)=>{
    const subCommentDoc: SubCommentDocument = res;
    saveUser(user);
    callback();
  }).catch(err=>{
    callback();
  });
}

/**
 * the function that will be executed in queue worker that fetches the sub comments
 * @param params the information that we need to request the batch of sub comments
 */
function func(params: SubCommentParams): Promise<any> {
  return new Promise((resolve, reject) => {
    const { cid, maxId, maxIdType, commentDoc } = params;
    getSubCommentApi(cid, maxId, maxIdType)
      .then(async (res) => {
        //console.log(res, "res in crawler subComment");
        const { data, maxId, maxIdType } = camelcaseKeys(res.data, {
          deep: true,
        });
        if (typeof data !== "object") {
          resolve();
          return;
        }
        await map(data,iteratee);
        const newSubComments: string[] = data.map((item: any) => item.id);
        commentDoc.update({$addToSet:{comments:newSubComments}});
        if (Number(maxId) !== 0) {
          console.log(q.length(),'q.length',q.running(),'q.running','in 2 or more crawler sub comment')
          q.push([{ func, params: { commentDoc, cid, maxId, maxIdType } }]);
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}
