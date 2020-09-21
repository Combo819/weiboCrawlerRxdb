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
import cors from "cors";
import { database } from "../database/connect";
import { Promise as PromiseBl } from "bluebird";
import _ from "lodash";
import path from "path";
import getPort from "get-port";

function startServer(): void {
  interface ResponseBody {
    status: "success" | "error";
    message?: any;
  }

  const app = express();

  app.use(express.urlencoded());
  app.use(express.json());
  app.use(cors());
  app.use("/static", express.static(path.resolve(__dirname, "../", "web")));
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
      .sort("saveTime")
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
      type PopulatedWeiboDoc = Omit<Omit<WeiboDocument, "user">, "comments"> & {
        user: UserDocument;
        comments: CommentDocument[];
      };
      const populatedWeiboDoc: PopulatedWeiboDoc = {
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
      type SubCommentWithUser = Omit<
        Omit<SubCommentDocument, "user">,
        "rootid"
      > & {
        user: UserDocument;
        rootid: CommentDocument;
      };
      const filteredSubCommentsUser: SubCommentWithUser[] = await PromiseBl.map(
        filteredSubComments,
        async (item) => {
          const userDoc: UserDocument = await item.populate("user");
          const commentDoc: CommentDocument = await item.populate("rootid");
          const newSubComment: SubCommentWithUser = {
            ...item._data,
            user: userDoc._data,
            rootid: commentDoc._data,
          };
          return newSubComment;
        }
      );
      type CommentPopulated = Omit<
        Omit<CommentDocument, "subComments">,
        "user"
      > & { subComments: SubCommentWithUser[]; user: UserDocument };
      const commentDocPopulated: CommentPopulated = {
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
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "web", "index.html"));
  });
  getPort({ port: [port, port + 1, port + 2] }).then((res: number) => {
    const availblePort: number = res;
    app.listen(availblePort || 5000, () => {
      console.log(`listening on port ${availblePort || 5000}`);
    });
  });
}

export default startServer;
