import crawlerWeibo from "./crawlers/crawlerWeibo";
import crawlerComment from "./crawlers/crawlerComment";
import crawlerRepostComment from './crawlers/crawlerRepostComment'

async function startCrawler(weiboId: string): Promise<any> {
  try {
    const weiboDoc = await crawlerWeibo(weiboId);
    if(weiboDoc){
      crawlerComment(weiboDoc, weiboId);
      crawlerRepostComment(weiboId,weiboDoc)
    }
  } catch (err) {
    throw err;
  }
}

export { startCrawler };
