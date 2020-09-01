/**
 * https://m.weibo.cn/comments/hotflow?id=4542206800570013&mid=4542206800570013&max_id=140357663182265&max_id_type=0
 * url to get comment, id/mid is the id for weibo, max_id by default is not specified. That will fetch the first batch of comments. you will see the max_id in response. That's the param
 * to request second batch of comment.
 */
import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { subCommentSchema, ISubComment } from "./subComment";
import { userSchema, IUser } from "./user";

export interface IComment extends Document {
  id: string;
  mid: string; // id for comment
  rootid: string; // id for comment
  rootidstr: string; // id for comment
  floorNumber: number;
  text: string; // unicode and html
  maxId: string;
  totalNumber: number; // the number of sub comments shown on client
  user: IUser["_id"];
  likeCount: number;
  subComments: Array<ISubComment["_id"]>;
}

const commentSchema = new Schema({
  id: { type: String, unique: true, required: true }, // id for comment
  mid: { type: String, unique: true, required: true }, // id for comment
  rootid: { type: String, unique: true, required: true }, // id for comment
  rootidstr: String, // id for comment
  floorNumber: Number,
  text: String, // unicode and html
  maxId: String,
  totalNumber: Number, // the number of sub comments shown on client
  user: { type: userSchema, required: true },
  likeCount: Number,
  subComments: [{ type: Schema.Types.ObjectId, ref: "SubComment" }],
});

const Comment: Model<IComment> = model("Comment", commentSchema);

export default Comment;