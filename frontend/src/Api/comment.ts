import {axios} from './config';
import { AxiosPromise } from 'axios';

/**
 * get comments from weiboId
 * @param weiboId the comments are under this weiboId
 * @param page 
 * @param pageSize 
 */
function getCommentsApi(weiboId:string,page:number,pageSize:number):AxiosPromise{
    return axios({
        url:`/comments/${weiboId}`,
        params:{page:page-1,pageSize}
    })
}

function getSingleCommentApi(commentId:string,page:number,pageSize:number):AxiosPromise{
    return axios({
        url:`/comment/${commentId}`,
        params:{page:page-1,pageSize}
    })
}

export {getCommentsApi,getSingleCommentApi};