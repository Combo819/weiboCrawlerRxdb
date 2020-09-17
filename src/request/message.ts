import {crawlerAxios} from "./config";
import { AxiosPromise } from "axios";

interface MessageParams{
    count:number,
    uid:string,
    since_id?:string,
}

function getMessage(params:MessageParams):AxiosPromise<any>{
    if(params.since_id){
        return crawlerAxios({
            url:'/api/chat/list',
            params,
        })
    }else{
        const {count,uid} = params;
        return crawlerAxios({
            url:'/api/chat/list',
            params:{count,uid},
        })
    }
    
}

export {getMessage};