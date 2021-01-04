import {axios} from './config';
import { AxiosPromise } from 'axios';

function getMonitorUsersApi():AxiosPromise{
    return axios({
        url:'/monitor'
    })
}

export {getMonitorUsersApi}