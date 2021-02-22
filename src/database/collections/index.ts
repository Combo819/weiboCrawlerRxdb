import CommentCollection, { commentSchema, CommentDocument, IComment } from "./comment";
import SubCommentCollection, {
  subCommentSchema,
  SubCommentDocument, ISubComment
} from "./subComment";
import UserCollection, { UserDocument, userSchema, IUser } from "./user";
import WeiboCollection, { WeiboDocument, weiboSchema, IWeibo, WeiboCollectionMethods } from "./weibo";
import RepostCommentCollection, {
  repostCommentSchema,
  IRepostComment,RepostCommentDocument
} from './repostComment';
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
  WeiboCollection, IWeibo, IUser, IComment, ISubComment, WeiboCollectionMethods,RepostCommentCollection,
  repostCommentSchema,RepostCommentDocument,
  IRepostComment
};
