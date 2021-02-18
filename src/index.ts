import { connectDB } from "./database";
import startServer from "./server/server";
import { Listener } from "./listener";
import PromiseBL from "bluebird";
import { getUserId, axios, checkCookie } from "./request";
import { getCredentialFile } from "./utility/readCredential";

getCredentialFile()
  .then((res) => {
    const { cookie, users: listenerUsers } = res;
    console.log(cookie);
    axios.defaults.headers.common["cookie"] = cookie;
    checkCookie(cookie).then(res => {
      console.warn('The cookie is invalid or expired');
      process.exit(1);
    }).catch(err => {
      if (err.response?.status === 404) {
        connectDB().then(async (db) => {
          let userIds: string[] = [];
          let usernames: string[] = [];
          await PromiseBL.map(
            listenerUsers,
            async (username: string) => {
              const userId: string = await getUserId(username);
              userIds.push(userId);
              usernames.push(username);
              return;
            },
            { concurrency: 2 }
          );
          const listener = new Listener(userIds || []);
          startServer(usernames);
        });
      } else {
        console.warn('The cookie is invalid or expired');
        process.exit(1);
      }
    })

  })
  .catch((err) => { console.log(err) });
