import { connectDB } from "./database";
import startServer from "./server/server";
import { Listener } from "./listener";
import PromiseBL from "bluebird";
import { getUserId, axios, checkCookie } from "./request";
import { getCredentialFile } from "./utility/readCredential";
const { Confirm } = require('enquirer');
getCredentialFile()
  .then((res) => {
    const { cookie, users: listenerUsers } = res;
    if (!cookie) {
      const prompt = new Confirm({
        name: 'question',
        message: '(non-cookie mode) No cookie detected. The message listener feature will be unavailable. Start anyway?'
      });
      prompt.run()
        .then((answer: Boolean) => {
          if (answer) {
            connectDB().then(async (db) => {
              startServer([]);
            }).catch(err => {
              console.log("Failed to connect to database", err);
              process.exit(1);
            });
          } else {
            console.log('Terminating process');
            process.exit(1);
          }
        });
      return;
    }
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
        }).catch(err => {
          console.log("Failed to connect to database", err);
          process.exit(1);
        });;
      } else {
        console.warn('The cookie is invalid or expired');
        process.exit(1);
      }
    })

  })
  .catch((err) => { console.log(err) });
