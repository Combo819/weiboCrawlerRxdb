import {
  UserCollection,
  WeiboCollection,
  CommentCollection,
  SubCommentCollection,
  weiboSchema,
  userSchema,
  commentSchema,
  subCommentSchema,WeiboCollectionMethods
} from "./collections";
import { URI } from "../config";
import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
  addRxPlugin,
} from "rxdb";

const weiboCollectionMethods: WeiboCollectionMethods = {
  countAllDocuments: async function(this: WeiboCollection) {
      const allDocs = await this.find().exec();
      return allDocs.length;
  }
};

type DataBaseCollections = {
  user: UserCollection;
  weibo: WeiboCollection;
  comment: CommentCollection;
  subcomment: SubCommentCollection;
};
type DatabaseType = RxDatabase<DataBaseCollections>;
addRxPlugin(require("pouchdb-adapter-leveldb"));
const leveldown = require("leveldown");

export let database: DatabaseType | null;
const connectDB = async () => {
  try {
    database = await createRxDatabase<DataBaseCollections>({
      name: "weibocrawler",
      adapter: leveldown,
    });
    await database.collection({
      name: "weibo",
      schema: weiboSchema,
      methods:weiboCollectionMethods
    });
    await database.collection({
      name: "user",
      schema: userSchema,
    });
    await database.collection({
      name: "comment",
      schema: commentSchema,
    });
    await database.collection({
      name: "subcomment",
      schema: subCommentSchema,
    });
    return database;
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
