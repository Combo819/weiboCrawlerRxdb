import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
} from "rxdb";
export type IWeibo = {
  _id: string;
  id: string;
  mid: string;
  createdAt: string;
  text: string;
  textLength: number;
  picIds: Array<string>;
  repostsCount: number;
  isLongText: boolean;
  commentsCount: number;
  attitudesCount: number;
  user: string;
  comments: string[];
  pics?: any[];
  pageInfo?: any;
  saveTime:number;
};

export const weiboSchema: RxJsonSchema<IWeibo> = {
  title: "weibo schema",
  version: 0,
  description: "weibo schema",
  type: "object",
  properties: {
    _id: { type: "string", primary: true },
    id: { type: "string" },
    mid: { type: "string" },
    createdAt: { type: "string" },
    text: { type: "string" },
    textLength: { type: "number" },
    picIds: { type: "array", items: { type: "string" } },
    repostsCount: { type: "number" },
    isLongText: { type: "boolean" },
    commentsCount: { type: "number" },
    attitudesCount: { type: "number" },
    user: { type: "string", ref: "user" },
    comments: { type: "array", ref: "comment", items: { type: "string" } },
    pics: { type: "array" },
    pageInfo: { type: "object" },
    saveTime:{type:'number'}
  },
  required: [
    "_id",
    "id",
    "mid",
    "createdAt",
    "text",
    "textLength",
    "picIds",
    "repostsCount",
    "isLongText",
    "commentsCount",
    "attitudesCount",
    "user",
    "comments",
  ],
  indexes: ['saveTime']
};

export type WeiboCollectionMethods = {
  countAllDocuments: () => Promise<number>;
}

export type WeiboDocument = RxDocument<IWeibo>;

type WeiboCollection = RxCollection<IWeibo,any,WeiboCollectionMethods>;

export default WeiboCollection;
