import { downloadVideoApi } from "../../request";
import { showProgress } from "../../utility/showProgress";
import fs from "fs";
import path from "path";
import { q } from "../queue";

export default function downloadVideo(url: string, staticPath: string): void {
  const params: QueueParams = {
    url,
    staticPath,
  };
  q.unshift([{ params, func }]);
}

function func(params: QueueParams): Promise<any> {
  const { url, staticPath } = params;
  return new Promise((resolve, reject) => {
    downloadVideoApi(url)
      .then((res) => {
        const { data, headers } = res;
        const urlPath = url.split("?")[0];
        if(!fs.existsSync(path.resolve(staticPath,'videos'))){
          fs.mkdirSync(path.resolve(staticPath,'videos'));
        }
        const writer = fs.createWriteStream(
          path.resolve(staticPath, "videos", path.basename(urlPath))
        );
        showProgress(data, headers["content-length"], path.basename(urlPath));
        data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      })
      .catch(reject);
  });
}

interface QueueParams {
  url: string;
  staticPath: string;
}
