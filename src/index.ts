import { connectDB } from "./database";
import startServer from "./server/server";
import { Listener } from "./listener";
import PromiseBL from "bluebird";
import { getUserId,axios } from "./request";
import { getTokenByPuppeteer } from "./browser";
import {getCredentialFile} from './utility/userInterface'


getCredentialFile().then(res=>{

  const {cookie,users:listenerUsers} = res;
  axios.defaults.headers.common['cookie'] = cookie; 
 
  connectDB().then(async (db) => {
    startServer();
    let userIds: string[] = [];
    await PromiseBL.map(listenerUsers, async (username: string) => {
      getUserId(username).then((userId: string) => {
        userIds.push(userId);
      });
    });

    const listener = new Listener(userIds || []);
  });

}).catch(err=>{

})


