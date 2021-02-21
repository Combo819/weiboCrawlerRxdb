import {axios} from './config';
import { AxiosPromise } from 'axios';
import { Weibo, User, SubComment, Comment } from '../types'
/**
 * get comments from weiboId
 * @param weiboId the comments are under this weiboId
 * @param page 
 * @param pageSize 
 */
function getCommentsApi(weiboId:string,page:number,pageSize:number):AxiosPromise<{comments:Comment[],totalNumber:number}>{
    return axios({
        url:`/comments/${weiboId}`,
        params:{page:page-1,pageSize}
    })
}

function getSingleCommentApi(commentId:string,page:number,pageSize:number):AxiosPromise<{comment:Comment,totalNumber:number}>{
    return axios({
        url:`/comment/${commentId}`,
        params:{page:page-1,pageSize}
    })
}

export {getCommentsApi,getSingleCommentApi};