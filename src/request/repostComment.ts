import { crawlerAxios } from "./config";
import { AxiosPromise } from "axios";

/**
 * 
 * @param {string} id the ID of the weibo
 * @param {number} page the repostComment page
 */
function getRepostCommentApi(
    id: string, page: number
): AxiosPromise {
    return crawlerAxios({
        url: "/api/statuses/repostTimeline",
        params: {
            id,
            page
        },
    });
}

export { getRepostCommentApi };
