import { connectDB } from "./database";
import startServer from "./server/server";
import {Listener} from './listener';
import {listenerUsers} from './config';
import PromiseBL from 'bluebird';
import {getUserId} from './request';
import {testPuppeteer} from './browser';
testPuppeteer();
false&&connectDB().then(async (db) => {
  startServer();
  let userIds:string[] = [];
  await PromiseBL.map(listenerUsers, async (username)=>{
   getUserId(username).then(userId=>{
     userIds.push(userId);
   });
  })
  
  const listener = new Listener(userIds||[]);
});
