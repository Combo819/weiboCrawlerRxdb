import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
} from "rxdb";

/**
 * Interface to model the User Schema for TypeScript.
 */
 type IUser = {
  _id: string;
  id: number;
  screenName: string;
  profileUrl: string;
  gender: string;
  followersCount: number;
  followCount: number;
  profileImageUrl: string; // the smaller profile image
  avatarHd: string; // a larger profile image,
};

export const userSchema:RxJsonSchema<IUser> = {
  title: "userSchema",
  version: 0,
  description: "user schema",
  type: "object",
  properties: {
    _id: { type: "string", "primary": true },
    id: { type: "number" },
    screenName: { type: 'string' }, // the name shown on weibo
    profileUrl: { type: "string" }, // the url to the user's profile page
    gender: { type: "string" },
    followersCount: { type: "number" },
    followCount: { type: "number" },
    profileImageUrl: { type: "string" }, // the smaller profile image
    avatarHd: { type: "string" }, // a larger profile image,
  },
  required: [
    "screenName",
    "_id",
    "id",
    "profileUrl",
    "gender",
    "followersCount",
    "followCount",
    "profileImageUrl",
    "avatarHd",
  ],
};

export type UserDocument = RxDocument<IUser>;
type UserCollection = RxCollection<IUser>;

export default UserCollection;
