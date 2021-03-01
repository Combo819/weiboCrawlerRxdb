import { axios } from "./config";
import { AxiosPromise } from "axios";
import { Weibo, User, SubComment, Comment } from '../types'
function getWeibosApi(page: number, pageSize: number): AxiosPromise<{ weibo: Weibo[], totalNumber: number }> {
  return axios({
    url: "/weibos",
    params: { page: page - 1, pageSize },
  });
}

/**
 * get a single weibo with comments by weiboId
 * @param weiboId the comments are under this weiboId
 * @param page page of comments
 * @param pageSize comments each page
 */
function getSingleWeiboApi(weiboId: string, page: number, pageSize: number): AxiosPromise<{ weibo: Weibo, totalNumber: number }> {
  return axios({
    url: `/weibo/${weiboId}`,
    params: { page: page - 1, pageSize }
  })
}

function saveWeiboApi(weiboIdUrl: string): AxiosPromise {
  return axios({
    method: 'post',
    url: `/save`,
    data: { weiboIdUrl }
  })
};

function deleteWeiboApi(weiboId: string): AxiosPromise<{result:boolean}> {
  return axios({
    method: 'delete',
    url: `/weibo/${weiboId}`,
  })
}

export { getWeibosApi, getSingleWeiboApi, saveWeiboApi,deleteWeiboApi };
