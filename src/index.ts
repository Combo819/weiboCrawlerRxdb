import { connectDB } from "./database";
import startServer from "./server/server";
import { conformsTo } from "lodash";

connectDB().then((db) => {
  
  startServer();
});
