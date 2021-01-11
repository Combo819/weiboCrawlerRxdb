import _ from "lodash";
import { getMessage ,getRealWeiboUrl} from "../request";
import { startCrawler } from "../crawler";
import isUrl from "is-url";
import { URL } from "url";
import cheerio from 'cheerio';
const url = require("url");

class Listener {
  private listeners: string[];
  private messageId: any;
  constructor(users:string[]) {
    this.listeners = users;
    this.messageId = {}; // {userId1:messageIdString[]}
    setInterval(() => {
      this.traverseListeners();
    }, 1000*60*2);
  }

  private traverseListeners(): void {
    this.listeners.forEach((userId: string) => {
      // if the this.messageId[userId] string[] is not created, push all messageId to it and do nothing.
      console.log(this.listeners,this.messageId);
      if (!this.messageId[userId]) {
        this.messageId[userId] = [];
        getMessage({ count: 10, uid: userId }).then((res) => {  
          const { msgs } = res.data.data;
          msgs.reverse().forEach((element: any) => {
            const { id: messageId } = element;
            this.messageId[userId].push(messageId);
          });
        }).catch(err=>{
            console.log(err);
        });
      } else {
        // if the this.messageId[userId] string[] is created, push the non-existed messageId to it and crawler the non-exist id.
        getMessage({
          count: 5,
          uid: userId,
          since_id: _.last(this.messageId[userId]),
        }).then((res) => {
          const { msgs } = res.data.data;
          msgs.reverse().forEach(async (element: any) => {
            const { id: messageId } = element;
            if (!this.messageId[userId].includes(messageId)) {
              this.messageId[userId].push(messageId);
              //call the crawler function
              const weiboId = await this.parseUrl(element.text);
              startCrawler(weiboId).then(res=>{
                  console.log(`weibo ${weiboId} got`)
              }).catch(err=>{
                  console.log(`failed to crawler from message ${element.text}`);
                  console.log(err);
              })
            }
          });
          if (this.messageId[userId].length > 40) {
            this.messageId[userId] = _.drop(this.messageId[userId], 10);
          }
        }).catch(err=>{
            console.log(err);
        });
      }
    });
  }
  addListener(userId: string): void {
    this.listeners.push(userId);
  }
  removeListener(userId: string): void {
    _.remove(this.listeners, (item) => item === userId);
  }
  private async parseUrl(msgText: string): Promise<string> {
    let weiboId:string|undefined;
    if (isUrl(msgText)) {
        weiboId = await this.parseWeiboId(msgText);
    }else{
        const $ = cheerio.load(msgText);
        const url:string = $('a').attr("href")||''
        weiboId = await this.parseWeiboId(url);
    }
    return weiboId||'';
  }
  private async parseWeiboId(urlStr: string) {
    let urlObj = new URL(urlStr);
    if(urlObj.hostname==='t.cn'){
      try{
        const {data} = await getRealWeiboUrl(urlStr);
        const url:string = data.match(/\"https:\/\/weibo.com.+(?=\?)/g)[0].replace(`"`,"");
        const realUrlObj = new URL(url);
        const weiboId = _.last(realUrlObj.pathname.split("/"));
        return weiboId
      }catch(err){
        console.log(err);
        return '';
      }
    }else{
      const weiboId = _.last(urlObj.pathname.split("/"));
      console.log(urlStr,weiboId)
      return weiboId;
    }
  }
}

export {Listener};
