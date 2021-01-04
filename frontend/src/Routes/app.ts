import { FunctionComponent, ComponentClass } from "react";
import { Weibo } from "../Views/Weibo";
import { Comments } from "../Views/Comments";
import { SubComments } from "../Views/SubComments";

export interface Route {
  path: string;
  component: FunctionComponent | ComponentClass;
  exact?: boolean;
}

const routes: Route[] = [
  { path: "/comments/:weiboId", component: Comments },
  { path: "/subComments/:commentId", component: SubComments },
  {
    path: "/",
    component: Weibo,
    exact: true,
  },
];

export default routes;
