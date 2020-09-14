/**
 * https://m.weibo.cn/comments/hotFlowChild?cid=4542209611793878&max_id=0&max_id_type=0 to get the subComment, the cid is the id of parent comment
 */
import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
} from "rxdb";

type ISubComment = {
  _id: string;
  id: string; //id for subComment
  mid: string; //id for subComment
  rootid: string; //id for parent comment
  rootidstr: string; //id for parent comment
  floorNumber: number;
  text: string; // unicode and html
  maxId: string;
  totalNumber: number; // the number of sub comments shown on client
  user: string;
  likeCount: number;
  createdAt:string
};

const subCommentSchema: RxJsonSchema<ISubComment> = {
  title: "userSchema",
  version: 0,
  description: "user schema",
  type: "object",
  properties: {
    _id: { type: "string", primary: true },
    id: { type: "number" },
    mid: { type: "string" },
    rootid: { type: "string",ref:'comment' },
    rootidstr: { type: "string" },
    floorNumber: { type: "number" },
    text: { type: "string" },
    maxId: { type: "string" },
    totalNumber: { type: "number" },
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
    "maxId",
    "totalNumber",
    "likeCount",
    "createdAt",
    "user",
  ],
};;
type SubCommentDocument = RxDocument<ISubComment>;




export default SubCommentDocument;
