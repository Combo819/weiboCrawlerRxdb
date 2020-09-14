/**
 * https://m.weibo.cn/comments/hotflow?id=4542206800570013&mid=4542206800570013&max_id=140357663182265&max_id_type=0
 * url to get comment, id/mid is the id for weibo, max_id by default is not specified. That will fetch the first batch of comments. you will see the max_id in response. That's the param
 * to request second batch of comment.
 */
import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
} from "rxdb";

type IComment = {
  _id: string;
  id: string;
  mid: string; // id for comment
  rootid: string; // id for comment
  rootidstr: string; // id for comment
  floorNumber: number;
  text: string; // unicode and html
  maxId: string;
  totalNumber: number; // the number of sub comments shown on client
  user: string;
  likeCount: number;
  createdAt: string;
  subComments: string[];
  pic: any;
  weiboId: string;
};

export const commentSchema: RxJsonSchema<IComment> = {
  title: "userSchema",
  version: 0,
  description: "user schema",
  type: "object",
  properties: {
    _id: { type: "string", primary: true },
    id: { type: "number" },
    mid: { type: "string" },
    rootid: { type: "string" },
    rootidstr: { type: "string" },
    floorNumber: { type: "number" },
    text: { type: "string" },
    maxId: { type: "string" },
    totalNumber: { type: "number" },
    likeCount: { type: "number" },
    createdAt: { type: "string" },
    weiboId: { type: "string",ref:'weibo' },
    user: { type: "string" ,ref:'user'},
    subComments: { type: "array",ref:'subComment', items: { type: "string" } },
    pic: { type: "object" },
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
    "weiboId",
    "user",
    "subComments",
    "pic",
  ],
};

export type CommentDocument = RxDocument<IComment>;

type CommentCollection = RxCollection<IComment>;

export default CommentCollection;
