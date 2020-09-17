import {crawlerAxios,axios} from "./config";
import { AxiosPromise } from "axios";
import FormData from 'form-data';
function getWeiboApi(weiboId:string):AxiosPromise{
    return crawlerAxios({
        url:`/detail/${weiboId}`
    })
}

function getRealWeiboUrl(shortUrl:string):AxiosPromise{
    const form = new FormData();
    form.append('turl',shortUrl);

    return axios({
        url:'https://duanwangzhihuanyuan.51240.com/web_system/51240_com_www/system/file/duanwangzhihuanyuan/get/',
        method:'post',
        params:{ajaxtimestamp:Date.now()},
        data:form,
    })
}

export {getWeiboApi,getRealWeiboUrl};