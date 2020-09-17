import {crawlerAxios} from "./config";
import { AxiosPromise } from "axios";
import _ from 'lodash';
function getUserId(username:string){
    return crawlerAxios({
        url:`/n/${username}`
    }).then((res:any)=>{
        
        const {request:{path}} = res;
        const pathArr = path.split('/') ;
        
        if(pathArr[1]==='u'){
           return pathArr[2];
        }else{
            throw new Error(`user ${username} doesn't exist`)
        }
    })
}

export {getUserId}