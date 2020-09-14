import CommentCollection, { commentSchema, CommentDocument,IComment } from "./comment";
import SubCommentCollection, {
  subCommentSchema,
  SubCommentDocument,
} from "./subComment";
import UserCollection, { UserDocument, userSchema,IUser } from "./user";
import WeiboCollection, { WeiboDocument, weiboSchema,IWeibo } from "./weibo";

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
  WeiboCollection,IWeibo,IUser,IComment
};
