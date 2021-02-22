import { getRepostCommentApi } from "../../request";
import { q } from "../queue";
import {
    WeiboDocument,
    IComment,
    IWeibo,
    CommentDocument,
    RepostCommentCollection,
    repostCommentSchema,
    IRepostComment, RepostCommentDocument
} from "../../database/collections";
import { database } from "../../database/connect";
import camelcaseKeys from "camelcase-keys";
import { saveUser } from "./saveUser";
import { map } from "async";

/**
 * the params that the func needs in async queue worker
 */
interface RepostCommentParams {
    weiboId: string;
    page: number;
    weiboDoc: WeiboDocument
}


export default function crawlerRepostComment(
    weiboId: string,
    weiboDoc: WeiboDocument
): void {
    const firstRepostCommentParams: RepostCommentParams = {
        weiboId,
        page: 1,
        weiboDoc
    };
    console.log(
        q.length(),
        "q.length",
        q.running(),
        "q.running",
        "in first crawler   comment"
    );
    q.push([{ func, params: firstRepostCommentParams }]);
    q.resume();
}

/**
 * the iteratee for async map function to iterate all comments in this batch and save them
 * @param item comment item
 * @param callback
 */
const iteratee = (item: any, callback: any): void => {
    const {
        id,
        mid,
        text,
        user,
        createdAt,
        retweetedStatus,
    } = item;

    const newRepostComment: IRepostComment = {
        id,
        mid,
        text,
        user: String(user.id),
        createdAt,
        retweetId: retweetedStatus.id,
    };
    if (!database) {
        return;
    }
    database.repostcomment
        .atomicUpsert(newRepostComment)
        .then((res) => {
            saveUser(user);
            callback();
        })
        .catch((err) => {
            console.log(err, 'error in crawlerComments 108');
        });
};

/**
 * the function that will be executed in queue worker that fetches the comments
 * @param params the information that we need to request the batch of comments
 */
const func = (params: RepostCommentParams): Promise<any> => {
    return new Promise((resolve, reject) => {
        const { weiboId, page, weiboDoc } = params;
        getRepostCommentApi(weiboId, page)
            .then(async (res) => {
                if (!res?.data?.data) {
                    resolve(null);
                    return;
                }
                const { data, max } = camelcaseKeys(res.data.data, {
                    deep: true,
                });
                await map(
                    data.map((item: any) => ({ ...item, weiboId })),
                    iteratee
                );
                const newRepostComments: string[] = data.map((item: any) => item.id);
                weiboDoc.update({
                    $addToSet: {
                        repostComments: { $each: newRepostComments },
                    },
                });
                if (page <= max) {
                    console.log(
                        q.length(),
                        "q.length",
                        q.running(),
                        "q.running",
                    );
                    q.push([
                        {
                            func: func, params: {
                                weiboId,
                                page: page + 1,
                                weiboDoc,
                            }
                        },
                    ]);
                }
                resolve(null);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
    });
};
