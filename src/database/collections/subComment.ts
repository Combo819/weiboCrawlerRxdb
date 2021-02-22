/**
 * https://m.weibo.cn/comments/hotFlowChild?cid=4542209611793878&max_id=0&max_id_type=0 to get the subComment, the cid is the id of parent comment
 */
import {
  RxCollection,
  RxJsonSchema,
  RxDocument,
} from "rxdb";

export type ISubComment = {
  _id: string;
  id: string; //id for subComment
  mid: string; //id for subComment
  rootid: string; //id for parent comment
  rootidstr: string; //id for parent comment
  floorNumber: number;
  text: string; // unicode and html
  user: string;
  likeCount: number;
  createdAt:string
};

export const subCommentSchema: RxJsonSchema<ISubComment> = {
  title: "subcomment schema",
  version: 0,
  description: "subcomment schema",
  type: "object",
  properties: {
    _id: { type: "string", primary: true },
    id: { type: "string" },
    mid: { type: "string" },
    rootid: { type: "string",ref:'comment' },
    rootidstr: { type: "string" },
    floorNumber: { type: "number" },
    text: { type: "string" },
    likeCount: { type: "number" },
    createdAt: { type: "string" },
    user: { type: "string", ref: "user" },
  },
  required: [
    "_id",
    "id",
    "mid",
    "rootid",
    "rootidstr",
    "floorNumber",
    "text",
    "likeCount",
    "createdAt",
    "user",
  ],
};;
export type SubCommentDocument = RxDocument<ISubComment>;

type SubCommentCollection = RxCollection<ISubComment>;



export default SubCommentCollection;
