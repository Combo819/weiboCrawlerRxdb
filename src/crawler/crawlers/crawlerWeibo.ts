import cheerio from "cheerio";
import { getWeiboApi } from "../../request";
import camelcaseKeys from "camelcase-keys";
import {
  WeiboDocument,
  WeiboCollection,
  IWeibo,
} from "../../database/collections";
import { database } from "../../database/connect";
import { saveUser } from "./saveUser";
import downloadImage from "../downloader/image";
import downloadVideo from "../downloader/video";
import { staticPath } from "../../config";
import { q } from "../queue";
import {startCrawler} from '../crawler'

async function crawlerWeibo(weiboId: string): Promise<WeiboDocument|null> {
  let weiboDoc: WeiboDocument | null;
  try {
    const res = await getWeiboApi(weiboId);

    const $ = cheerio.load(res.data);
    let renderText: string;
    try {
      renderText = $("script").get()[1].children[0].data;
    } catch (err) {
      console.error(`the weibo doesn't exist or cookie expired`);
      throw err;
    }
    const renderData = Function(renderText + " return $render_data")();
    const status = camelcaseKeys(renderData.status, { deep: true });
   
    const resDoc: WeiboDocument | null = await saveWeibo(status);
    if(status.retweetedStatus){
      startCrawler(status.retweetedStatus.id);
    }
    saveUser(status.user);
    weiboDoc = resDoc;
    return weiboDoc
  } catch (err) {
    if (err) {
      console.log(err, "err in crawler weibo");
    }
  }
  if(!database){
    throw new Error('database is not created!');
  }
  try{
     weiboDoc = await database.weibo.findOne(weiboId).exec();
    if(weiboDoc){
      return weiboDoc;
    }
  }catch(err){
    throw new Error('cannot find weibo '+weiboId+' in database')
  }
  return weiboDoc
}

function saveWeibo(status: any): Promise<WeiboDocument> {
  return new Promise(async (resolve, reject) => {
    const {
      id,
      mid,
      createdAt,
      picIds,
      text,
      textLength,
      repostsCount,
      isLongText,
      commentsCount,
      attitudesCount,
      user: { id: userId },
      pics,
      pageInfo,
      retweetedStatus
    } = status;
    if (!database) {
      return reject("database is not created");
    }

    const newWeibo: IWeibo = {
      _id: id,
      id,
      mid,
      createdAt,
      picIds,
      text,
      textLength,
      repostsCount,
      isLongText,
      commentsCount,
      attitudesCount,
      user: String(userId) ,
      pics,
      comments: [],
      pageInfo,
      saveTime:Date.now(),
      repostingId:retweetedStatus?.id,
      repostComments:[]
    }; 
    try {
      
      q.pause();
      if (pics && pics.length > 0) {
        pics.forEach((element: any) => {
          downloadImage(element.large.url, staticPath);
        });
      }
      if (pageInfo&&pageInfo.urls) {
        const { mp4720PMp4, mp4HdMp4, mp4LdMp4 } = pageInfo.urls;
        const videoUrl = [mp4720PMp4, mp4HdMp4, mp4LdMp4].find(
          (ele) => typeof ele === "string"
        );
        newWeibo.pageInfo.url = videoUrl;
        downloadVideo(videoUrl, staticPath);
      }
      const weiboDoc: WeiboDocument = await database.weibo.atomicUpsert(newWeibo);
      resolve(weiboDoc);
    } catch (err) {
      console.log(err);
      reject('failed to insert weibo'+id)
    }
  });
}

export default crawlerWeibo;
