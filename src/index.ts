import { connectDB } from "./database";
import startServer from "./server/server";
import { Listener } from "./listener";
import PromiseBL from "bluebird";
import { getUserId, axios } from "./request";
import { getCredentialFile } from "./utility/userInterface";

getCredentialFile()
  .then((res) => {
    const { cookie, users: listenerUsers } = res;
    axios.defaults.headers.common["cookie"] = cookie;
    console.log(`cookie:${cookie}\nusers:${listenerUsers}`);
    connectDB().then(async (db) => {
      let userIds: string[] = [];
      let usernames: string[] = [];
      await PromiseBL.map(
        listenerUsers,
        async (username: string) => {
          const userId:string = await getUserId(username);
          userIds.push(userId);
          usernames.push(username);
          return;
        },
        { concurrency: 2 }
      );

      const listener = new Listener(userIds || []);
      startServer(usernames);
    });
  })
  .catch((err) => {console.log(err)});
