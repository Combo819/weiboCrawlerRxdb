import {
  UserCollection,
  WeiboCollection,
  CommentCollection,
  SubCommentCollection,
  weiboSchema,
  userSchema,
  commentSchema,
  subCommentSchema, WeiboCollectionMethods, RepostCommentCollection,
  repostCommentSchema,
  IRepostComment
} from "./collections";
import {
  createRxDatabase,
  RxDatabase,
  addRxPlugin,
} from "rxdb";
import { rxdbPath } from '../config'

const weiboCollectionMethods: WeiboCollectionMethods = {
  countAllDocuments: async function (this: WeiboCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  }
};

type DataBaseCollections = {
  user: UserCollection;
  weibo: WeiboCollection;
  comment: CommentCollection;
  subcomment: SubCommentCollection;
  repostComment:RepostCommentCollection
};
type DatabaseType = RxDatabase<DataBaseCollections>;
addRxPlugin(require("pouchdb-adapter-leveldb"));
const leveldown = require("leveldown");

export let database: DatabaseType | null;
const connectDB = async () => {
  try {
    database = await createRxDatabase<DataBaseCollections>({
      name: rxdbPath,
      adapter: leveldown,
    });
    await database.collection({
      name: "weibo",
      schema: weiboSchema,
      statics: weiboCollectionMethods
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
    await database.collection({
      name:"repostComment",
      schema:repostCommentSchema,
    })
    return database;
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
