import { crawlerAxios } from "./config";
import { AxiosPromise } from "axios";

/**
 *
 * @param cid the id of the parent comment
 * @param maxId the max id of the comment request. not specified if it's the first request to fetch the comment
 * @param mid same as max_id as I observe
 * @param maxIdType always 0 as I observe
 */
function getSubCommentApi(
  cid: string,
  maxId?: string | undefined,
  maxIdType?: number | undefined
): AxiosPromise {
  return crawlerAxios({
    url: "/comments/hotFlowChild",
    params: {
      cid:cid,
      max_id: maxId||0,
      max_id_type: maxIdType || 0,
    },
  });
}

export { getSubCommentApi };
