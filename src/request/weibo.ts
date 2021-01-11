import {crawlerAxios,axios} from "./config";
import { AxiosPromise } from "axios";
function getWeiboApi(weiboId:string):AxiosPromise{
    return crawlerAxios({
        url:`/detail/${weiboId}`
    })
}

function getRealWeiboUrl(shortUrl:string):AxiosPromise{
    return crawlerAxios({
        url:shortUrl
    });
}

function checkCookie(cookie:string):AxiosPromise{
    return crawlerAxios({
        url:'/users/show'
    })
}

export {getWeiboApi,getRealWeiboUrl,checkCookie};