import { axios } from "./config";
import { AxiosPromise } from "axios";

function getWeibosApi(page: number, pageSize: number): AxiosPromise {
  return axios({
    url: "/weibos",
    params: { page:page-1, pageSize },
  });
}

/**
 * get a single weibo with comments by weiboId
 * @param weiboId the comments are under this weiboId
 * @param page page of comments
 * @param pageSize comments each page
 */
function getSingleWeiboApi(weiboId:string,page:number,pageSize:number):AxiosPromise{
  return axios({
    url:`/weibo/${weiboId}`,
    params:{page:page-1,pageSize}
  })
}

function saveWeiboApi(weiboId:string):AxiosPromise{
  return axios({
    method:'post',
    url:`/save`,
    data:{weiboId}
  })
}

export {getWeibosApi,getSingleWeiboApi,saveWeiboApi};
