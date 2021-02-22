import { FunctionComponent, ComponentClass } from "react";
import { WeiboList } from "../Views/WeiboList";
import { WeiboContent } from "../Views/WeiboContent";
import { CommentContent } from "../Views/CommentContent";

export interface Route {
  path: string;
  component: FunctionComponent | ComponentClass;
  exact?: boolean;
}

const routes: Route[] = [
  { path: "/weibo/:weiboId", component: WeiboContent },
  { path: "/comment/:commentId", component: CommentContent },
  {
    path: "/",
    component: WeiboList,
    exact: true,
  },
];

export default routes;
