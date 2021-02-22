type User = {
  _id: string;
  id: string;
  screenName: string;
  profileUrl: string;
  gender: string;
  followersCount: number;
  followCount: number;
  profileImageUrl: string; // the smaller profile image
  avatarHd: string; // a larger profile image,
};

type SubComment = {
  _id: string;
  id: string; //id for subComment
  mid: string; //id for subComment
  rootid: string; //id for parent comment
  rootidstr: string; //id for parent comment
  floorNumber: number;
  text: string; // unicode and html
  user: User;
  likeCount: number;
  createdAt: string;
};

type Comment = {
  _id: string;
  id: string;
  mid: string; // id for comment
  rootid: string; // id for comment
  rootidstr: string; // id for comment
  floorNumber: number;
  text: string; // unicode and html
  maxId: string;
  totalNumber: number; // the number of sub comments shown on client
  user: User;
  likeCount: number;
  createdAt: string;
  subComments: string[] | SubComment[];
  pic: any;
  weiboId: string;
};

type Weibo = {
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
  user: User;
  comments: string[] | Comment[];
  pics?: any[];
  pageInfo?: any;
  saveTime: number;
  repostingId: string;
  reposting?: Weibo;
};

type RepostComment = {
  id: string; //id for subComment
  mid: string; //id for subComment
  text: string; // unicode and html
  user: User;
  createdAt: string;
  retweetId: string;
}

export type { Weibo, User, SubComment, Comment,RepostComment };
