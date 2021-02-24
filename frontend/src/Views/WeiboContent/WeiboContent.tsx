import React, { useEffect, useState } from "react";
import { Col, Row, PageHeader, List, Avatar, Pagination } from "antd";
import { WeiboCard } from "../../Component/WeiboCard";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { getSingleWeiboApi } from "../../Api";
import { CommentList } from "../../Component/CommentList";
import { Weibo } from "../../types";
import { Switch, Route } from 'react-router-dom';
import { RepostCommentList } from "../../Component/RepostCommentList";
function WeiboContent(props: React.Props<any>) {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  function usePushState() {
    return useLocation().state || { page: 1, pageSize: 10 };
  }
  const history = useHistory();
  const { weiboId } = useParams<{ weiboId: string }>();
  const query = useQuery();
  const [weibo, setWeibo] = useState<Weibo>({ comments: [] } as any);
  const [loading, setLoading] = useState(false);
  const { page: backPage, pageSize: backPageSize } = usePushState() as any;

  useEffect(() => {
    setLoading(true);
    getSingleWeiboApi(
      weiboId,
      parseInt(query.get("page") || "1"),
      parseInt(query.get("pageSize") || "10")
    )
      .then((res) => {
        const { weibo, totalNumber } = res.data;
        setWeibo(weibo);
        setLoading(false);
      })
      .catch((err) => { });
  }, [weiboId]);

  return (
    <>
      <Row justify="center">
        <Col style={{ width: 600 }}>
          <PageHeader
            className="site-page-header"
            onBack={() => {
              history.push({
                pathname: `/`,
                search: `?page=${backPage||1}&pageSize=${backPageSize||10}`,
              });
            }}
            title="Back"
            subTitle="Back to weibo list"
          />
        </Col>
      </Row>
      <Row justify="center">
        <Col style={{ width: 600 }}>
          <WeiboCard
            isWeiboContent={true}
            loading={loading}
            weibo={weibo}
          ></WeiboCard>
        </Col>
      </Row>
      <Switch>
        <Route path="/weibo/:weiboId/comments">
          <CommentList />
        </Route>
        <Route path="/weibo/:weiboId/reposts">
          <RepostCommentList />
        </Route>
      </Switch>

    </>
  );
}

export default WeiboContent;
