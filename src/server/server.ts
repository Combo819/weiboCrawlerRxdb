import { RepostCommentDocument } from './../database/collections/repostComment';

import { startCrawler } from "../crawler";
import {
  WeiboCollection,
  WeiboDocument,
  UserDocument,
  CommentDocument,
  CommentCollection,
  SubCommentDocument,

} from "../database/collections";
import { port, staticPath } from "../config";
import express, { Application, Request, Response } from "express";

import { database } from "../database/connect";
import { Promise as PromiseBl } from "bluebird";
import _ from "lodash";
import path from "path";
import getPort from "get-port";
import {parseWeiboId} from '../utility/parseWeiboId'
const open = require("open");
function startServer(usernames: string[]): void {
  interface ResponseBody {
    status: "success" | "error";
    message?: any;
  }

  const app: Application = express();

  app.use(express.urlencoded({extended:true}));
  app.use(express.json());


  app.use(express.static(staticPath));

  //save a weibo
  app.post("/api/save", async (request: Request, response: Response) => {
    const { weiboIdUrl }: { weiboIdUrl: string } = request.body;
    let weiboId:string = "";
    try{
  
      weiboId = await parseWeiboId(weiboIdUrl);

    }catch(err){
      const resBody: ResponseBody = { status: "error", message: "Weibo url or Id is invalid"};
      response.send(resBody);
    }
    startCrawler(weiboId)
      .then((res) => {
        const resBody: ResponseBody = { status: "success", message: res };
        response.send(resBody);
      })
      .catch((err) => {
        console.log(err)
        const resBody: ResponseBody = { status: "error" };
        response.send(resBody);
      });
  });

  //get the username list that you're monitoring
  app.get('/api/monitor', (request: Request, response: Response) => {
    response.send({ users: usernames });
  })

  //get a list of weibos
  app.get("/api/weibos", (request: Request, response: Response) => {
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      response.status(400).send("Database is not created")
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
        const weibosPopulated = await PromiseBl.map(
          weiboDocs,
          async (item: WeiboDocument) => {
            const userPopulated: UserDocument = await item.populate("user");
            const reposting: WeiboDocument = await item.populate('repostingId');
            let repostingUser: UserDocument | undefined;
            if (reposting) {
              repostingUser = await reposting.populate('user');
            }
            return {
              ...item.toJSON(),
              user: userPopulated?.toJSON(),
              reposting: { ...reposting?.toJSON(), user: repostingUser?.toJSON() },
            };
          }
        );
        const totalNumber = await weiboCollection.countAllDocuments();
        response.send({ weibo: weibosPopulated, totalNumber });
      });
  });

  //delete a weibo record by Id
  app.delete('/api/weibo/:weiboId',async (request: Request, response: Response)=>{
    const { weiboId } = request.params;
    if (!database) {
      console.log("database is not created");
      response.status(400).send("Database is not created")
      return;
    };
    const weiboCollection: WeiboCollection = database.weibo;
    const weiboDoc: WeiboDocument | null = await weiboCollection
      .findOne(weiboId)
      .exec();
    if(weiboDoc){
      try{
        const result = await weiboDoc.remove();
        return response.send({result});
      }catch(err){
        console.log(err);
      }
    }
    return response.send({result:false})
  })

  //get weibo content by a given weiboId
  app.get("/api/weibo/:weiboId", async (request: Request, response: Response) => {
    const { weiboId } = request.params;
    if (!database) {
      console.log("database is not created");
      response.status(400).send("Database is not created")
      return;
    }
    const weiboCollection: WeiboCollection = database.weibo;
    const weiboDoc: WeiboDocument | null = await weiboCollection
      .findOne(weiboId)
      .exec();
    if (weiboDoc) {
      const userDoc: UserDocument = await weiboDoc.populate("user");
      const reposting: WeiboDocument = await weiboDoc.populate("repostingId");
      let repostingUser: UserDocument | undefined;
      if (reposting) {
        repostingUser = await reposting.populate('user');
      };
      const populatedWeiboDoc = {
        ...weiboDoc?.toJSON(),
        user: userDoc?.toJSON(),
        reposting: { ...reposting?.toJSON(), user: repostingUser?.toJSON() }
      };
      response.send({ weibo: populatedWeiboDoc, totalNumber: 1 });
    } else {
      response.send({ weibo: null, totalNumber: 0 });
    }
  });

  //get comments list by a given weiboId
  app.get("/api/comments/:weiboId", async (request: Request, response: Response) => {
    const { weiboId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      response.status(400).send("Database is not created")
      return;
    }
    const weiboCollection: WeiboCollection = database.weibo;
    const weiboDoc: WeiboDocument | null = await weiboCollection
      .findOne(weiboId)
      .exec();
    if (weiboDoc) {
      const comments: CommentDocument[] = await weiboDoc.populate("comments");
      const filteredComments: CommentDocument[] = _.chain(comments)
        .drop(parseInt(page) * parseInt(pageSize))
        .take(parseInt(pageSize))
        .value();
      const filteredCommentsWithUser = await PromiseBl.map(
        filteredComments,
        async (item) => {
          const userDoc: UserDocument = await item.populate("user");
          return { ...item.toJSON(), user: userDoc.toJSON() };
        }
      );
      response.send({
        comments: filteredCommentsWithUser,
        totalNumber: comments.length,
      });
    } else {
      response.send({ comments: [], totalNumber: 0 });
    }
  });

  //get repostComment list by a given weiboId
  app.get('/api/repostComments/:weiboId', async (request: Request, response: Response) => {
    const { weiboId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      response.status(400).send("Database is not created")
      return;
    }
    const weiboCollection: WeiboCollection = database.weibo;
    const weiboDoc: WeiboDocument | null = await weiboCollection
      .findOne(weiboId)
      .exec();
    if (weiboDoc) {
      const repostComments: RepostCommentDocument[] = await weiboDoc.populate("repostComments");
      const filteredRepostComments: RepostCommentDocument[] = _.chain(repostComments)
        .drop(parseInt(page) * parseInt(pageSize))
        .take(parseInt(pageSize))
        .value();
      const filteredRepostCommentsWithUser = await PromiseBl.map(
        filteredRepostComments,
        async (item) => {
          const userDoc: UserDocument = await item.populate("user");
          return { ...item.toJSON(), user: userDoc.toJSON() };
        }
      );
      response.send({
        repostComments: filteredRepostCommentsWithUser,
        totalNumber: repostComments.length,
      });
    } else {
      response.send({ repostComments: [], totalNumber: 0 });
    }


  });
  // get comment content by a given comment
  app.get("/api/comment/:commentId", async (request: Request, response: Response) => {
    const { commentId } = request.params;
    if (!database) {
      console.log("database is not created");
      response.status(400).send("Database is not created")
      return;
    }
    const commentCollection: CommentCollection = database.comment;
    const commentDoc: CommentDocument | null = await commentCollection
      .findOne(commentId)
      .exec();
    if (commentDoc) {
      const user: UserDocument = await commentDoc.populate("user");
      const commentDocPopulated = {
        ...commentDoc.toJSON(),
        user: user.toJSON(),
      };
      response.send({
        comment: commentDocPopulated,
        totalNumber: 1,
      });
    } else {
      response.send({ comment: null, totalNumber: 0 });
    }
  });

  //get subComments list by a given commentId
  app.get('/api/subComment/:commentId', async (request: Request, response: Response) => {
    const { commentId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    if (!database) {
      console.log("database is not created");
      response.status(400).send("Database is not created")
      return;
    }
    const commentCollection: CommentCollection = database.comment;
    const commentDoc: CommentDocument | null = await commentCollection
      .findOne(commentId)
      .exec();
    if (commentDoc) {
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
            ...item.toJSON(),
            user: userDoc.toJSON(),
            rootid: commentDoc.toJSON(),
          };
          return newSubComment;
        }
      );
      response.send({
        subComments: filteredSubCommentsUser,
        totalNumber: subComments.length,
      });
    } else {
      response.send({ subComments: [], totalNumber: 0 });
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
        console.log(`Failed to open http://localhost:${availblePort}, please open it on your browser`)
      }
    });
  });
}

export default startServer;
