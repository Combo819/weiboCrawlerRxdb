import { getRealWeiboUrl } from '../../request';
import isUrl from "is-url";
import cheerio from 'cheerio';
import { URL } from "url";
import _ from "lodash";
import { url } from 'inspector';

/**
 * retrieve url from message
 * @param msgText message text
 */
export async function parseUrl(msgText: string): Promise<string> {
  let weiboId: string | undefined;
  if (isUrl(msgText)) {
    weiboId = await parseWeiboId(msgText);
  } else {
    const $ = cheerio.load(msgText);
    const url: string = $('a').attr("href") || ''
    weiboId = await parseWeiboId(url);
  }
  return weiboId;
}

/**
 * get weibo id from url
 * @param urlStr possible weibo url
 */
export async function parseWeiboId(urlStr: string) {
  //if the string contains only digits
  if (/^[0-9]*$/.test(urlStr)) {
    return urlStr;
  }
  let urlObj = new URL(urlStr);
  if (urlObj.hostname === 't.cn') {
    try {
      const { data } = await getRealWeiboUrl(urlStr);
      const url: string = data.match(/\"https:\/\/weibo.com.+(?=\?)/g)[0].replace(`"`, "");
      const realUrlObj = new URL(url);
      const weiboId = _.last(_.trimEnd(realUrlObj.pathname, "/").split("/"));
      return weiboId || ""
    } catch (err) {
      console.log(err);
      return '';
    }
  } else if (urlObj.hostname === "share.api.weibo.cn") {
    return urlObj.searchParams.get("weibo_id") || '';
  } else {
    const weiboId = _.last(_.trimEnd(urlObj.pathname, "/").split("/"));
    return weiboId || "";
  }
}