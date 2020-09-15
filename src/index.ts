import { connectDB } from "./database";
import startServer from "./server/server";

connectDB().then((db) => {
  startServer();
});
