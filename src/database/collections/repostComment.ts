/**
 * https://m.weibo.cn/comments/hotFlowChild?cid=4542209611793878&max_id=0&max_id_type=0 to get the subComment, the cid is the id of parent comment
 */
import {
    RxCollection,
    RxJsonSchema,
    RxDocument,
  } from "rxdb";
  
  export type IRepostComment = {
    id: string; //id for subComment
    mid: string; //id for subComment
    text: string; // unicode and html
    user: string;
    createdAt:string;
    retweetId:string;
  };
  
  export const repostCommentSchema: RxJsonSchema<IRepostComment> = {
    title: "repostComment schema",
    version: 0,
    description: "repostComment schema",
    type: "object",
    properties: {
      id: { type: "string",primary: true },
      mid: { type: "string" },
      text: { type: "string" },
      createdAt: { type: "string" },
      user: { type: "string", ref: "user" },
      retweetId:{ type: "string", ref: "weibo" }
    },
    required: [
      "id",
      "mid",
      "text",
      "createdAt",
      "user",
    ],
  };;
  export type RepostCommentDocument = RxDocument<IRepostComment>;
  
  type RepostCommentCollection = RxCollection<IRepostComment>;
  
  export default RepostCommentCollection;
  