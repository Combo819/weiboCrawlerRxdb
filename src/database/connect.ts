import {
  UserCollection,
  WeiboCollection,
  CommentCollection,
  SubCommentCollection,
  weiboSchema,
  userSchema,
  commentSchema,
  subCommentSchema,
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

type DataBaseCollections = {
  user: UserCollection;
  weibo: WeiboCollection;
  comment: CommentCollection;
  subComment: SubCommentCollection;
};
type DatabaseType = RxDatabase<DataBaseCollections>;
addRxPlugin(require("pouchdb-adapter-leveldb"));
const leveldown = require("leveldown");

export let database: DatabaseType | null;
const connectDB = async () => {
  try {
    database = await createRxDatabase<DataBaseCollections>({
      name: "weiboCrawler",
      adapter: leveldown,
    });
    await database.collection({
      name: "weibo",
      schema: weiboSchema,
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
      name: "subComment",
      schema: subCommentSchema,
    });
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
