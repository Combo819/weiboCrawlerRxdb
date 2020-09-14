import CommentCollection, { commentSchema, CommentDocument } from "./comment";
import SubCommentCollection, {
  subCommentSchema,
  SubCommentDocument,
} from "./subComment";
import UserCollection, { UserDocument, userSchema } from "./user";
import WeiboCollection, { WeiboDocument, weiboSchema } from "./weibo";

export {
  CommentDocument,
  commentSchema,
  SubCommentDocument,
  subCommentSchema,
  UserDocument,
  userSchema,
  WeiboDocument,
  weiboSchema,
  CommentCollection,
  SubCommentCollection,
  UserCollection,
  WeiboCollection,
};
