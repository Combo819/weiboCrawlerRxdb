import { startCrawler } from "../crawler";
import {
  WeiboCollection,
  WeiboDocument,
  UserDocument,
  CommentDocument,
  CommentCollection,
  SubCommentDocument,
} from "../database/collections";
import { port, credentialJsonPath, staticPath } from "../config";
import express from "express";

import { database } from "../database/connect";
import { Promise as PromiseBl } from "bluebird";
import _ from "lodash";
import path from "path";
import getPort from "get-port";

const open = require("open");
function startServer(usernames: string[]): void {
  interface ResponseBody {
    status: "success" | "error";
    message?: any;
  }

  const app = express();

  app.use(express.urlencoded());
  app.use(express.json());


  app.use(express.static(staticPath));

  app.post("/api/save", (request, response) => {
    const { weiboId }: { weiboId: string } = request.body;
    console.log(weiboId, "weiboId");
    startCrawler(weiboId)
      .then((res) => {
        const resBody: ResponseBody = { status: "success", message: res };
        response.send(resBody);
      })
      .catch((err) => {
        const resBody: ResponseBody = { status: "error" };
        response.send(resBody);
      });
  });

  app.get('/api/monitor', (request, response) => {
    response.send({ users: usernames });
  })

  app.get("/api/weibos", (request, response) => {
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      return;
    }
    const weiboCollection: WeiboCollection = database.weibo;
    weiboCollection
      .find()
      .sort({ saveTime: "desc" })
      .limit(parseInt(pageSize))
      .skip(parseInt(pageSize) * parseInt(page))
      .exec()
      .then(async (weiboDocs: WeiboDocument[]) => {
        const weibosPopulated: any = await PromiseBl.map(
          weiboDocs,
          async (item) => {
            const userPopulated = await item.populate("user");

            return {
              ...item._data,
              user: userPopulated._data,
            };
          }
        );
        const totalNumber = await weiboCollection.countAllDocuments();
        response.send({ weibo: weibosPopulated, totalNumber });
      });
  });

  app.get("/api/weibo/:weiboId", async (request, response) => {
    const { weiboId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      return;
    }
    const weiboCollection: WeiboCollection = database.weibo;
    const weiboDoc: WeiboDocument | null = await weiboCollection
      .findOne(weiboId)
      .exec();
    if (weiboDoc) {
      const user = await weiboDoc.populate("user");
      const comments: CommentDocument[] = await weiboDoc.populate("comments");
      const userDoc: UserDocument = user;
      const filteredComments: CommentDocument[] = _.chain(comments)
        .drop(parseInt(page) * parseInt(pageSize))
        .take(parseInt(pageSize))
        .value();
      const filteredCommentsWithUser = await PromiseBl.map(
        filteredComments,
        async (item) => {
          const userDoc: UserDocument = await item.populate("user");
          return { ...item._data, user: userDoc._data };
        }
      );
      const populatedWeiboDoc = {
        ...weiboDoc._data,
        user: userDoc._data,
        comments: filteredCommentsWithUser,
      };
      response.send({ weibo: populatedWeiboDoc, totalNumber: comments.length });
    } else {
      response.send({ weibo: null, totalNumber: 0 });
    }
  });

  app.get("/api/comments/:weiboId", async (request, response) => {
    const { weiboId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      return;
    }
    const weiboCollection: WeiboCollection = database.weibo;
    const weiboDoc: WeiboDocument | null = await weiboCollection
      .findOne(weiboId)
      .exec();
    if (weiboDoc) {
      const user = await weiboDoc.populate("user");
      const comments: CommentDocument[] = await weiboDoc.populate("comments");
      const userDoc: UserDocument = user;
      const filteredComments: CommentDocument[] = _.chain(comments)
        .drop(parseInt(page) * parseInt(pageSize))
        .take(parseInt(pageSize))
        .value();
      const filteredCommentsWithUser = await PromiseBl.map(
        filteredComments,
        async (item) => {
          const userDoc: UserDocument = await item.populate("user");
          return { ...item._data, user: userDoc._data };
        }
      );
      response.send({
        comments: filteredCommentsWithUser,
        totalNumber: comments.length,
      });
    } else {
      response.send({ weibo: null, totalNumber: 0 });
    }
  });

  app.get("/api/comment/:commentId", async (request, response) => {
    const { commentId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      return;
    }
    const commentCollection: CommentCollection = database.comment;
    const commentDoc: CommentDocument | null = await commentCollection
      .findOne(commentId)
      .exec();
    if (commentDoc) {
      const user: UserDocument = await commentDoc.populate("user");
      const subComments: SubCommentDocument[] = await commentDoc.populate(
        "subComments"
      );
      const filteredSubComments: SubCommentDocument[] = _.chain(subComments)
        .drop(parseInt(page) * parseInt(pageSize))
        .take(parseInt(pageSize))
        .value();
      const filteredSubCommentsUser = await PromiseBl.map(
        filteredSubComments,
        async (item) => {
          const userDoc: UserDocument = await item.populate("user");
          const commentDoc: CommentDocument = await item.populate("rootid");
          const newSubComment = {
            ...item._data,
            user: userDoc._data,
            rootid: commentDoc._data,
          };
          return newSubComment;
        }
      );
      const commentDocPopulated = {
        ...commentDoc._data,
        user: user._data,
        subComments: filteredSubCommentsUser,
      };
      response.send({
        comment: commentDocPopulated,
        totalNumber: subComments.length,
      });
    } else {
      response.send({ comment: null, totalNumber: 0 });
    }
  });
  app.use("/", express.static(path.resolve(__dirname, "../../", "frontend", "build")));

  getPort({ port: [port, port + 1, port + 2] }).then((res: number) => {
    const availblePort: number = res;
    app.listen(availblePort || 5000, () => {
      console.log(`listening on port ${availblePort || 5000} \n`);
      console.log(`opening http://localhost:${availblePort}`);
      try {
        open(`http://localhost:${availblePort}`);
      } catch (err) {
        console.log(err, `Failed to open http://localhost:${availblePort}, please open it on your browser`)
      }
    });
  });
}

export default startServer;
