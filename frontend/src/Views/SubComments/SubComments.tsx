import React, { useEffect, useState } from "react";
import { Col, Row, PageHeader, Card, Avatar } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { getSingleCommentApi } from "../../Api";
import {SubCommentList} from '../../Component/SubCommentList'
import HtmlParser from "react-html-parser";
import { getImageUrl } from "../../Utility/parseUrl";
function SubComments(props: React.Props<any>) {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  function usePushState() {
    return useLocation().state || { page: 1, pageSize: 10 };
  }
  const history = useHistory();
  console.log(useLocation(), "useLocation().state");
  const { commentId } = useParams();
  const query = useQuery();
  const [comment, SetComment] = useState({
    likeCount: 0,
    text: "",
    user: { avatarHd: "", screenName: "" },
    weiboId:''
  });
  const [loading, setLoading] = useState(false);
  const { page: backPage, pageSize: backPageSize } = usePushState() as any;

  useEffect(() => {
    setLoading(true);
    getSingleCommentApi(
      commentId,
      parseInt(query.get("page") || "1"),
      parseInt(query.get("pageSize") || "10")
    )
      .then((res) => {
        const { comment, totalNumber } = res.data;
        SetComment(comment);
        setLoading(false);
      })
      .catch((err) => {});
  }, [commentId]);

  return (
    <>
      <Row justify="center">
        <Col style={{ width: 600 }}>
          <PageHeader
            className="site-page-header"
            onBack={() => {
              history.push({
                pathname: `/comments/${comment&&comment.weiboId}`,
                search: `?page=${backPage}&pageSize=${backPageSize}`,
              });
            }}
            title="Back"
            subTitle="Back to comment list"
          />
        </Col>
      </Row>
      <Row justify="center">
        <Col style={{ width: 600 }}>
          <Card
            style={{ width: "100%" }}
            actions={[
              <>
                <LikeOutlined
                  style={{ position: "relative", top: -3 }}
                  key="like"
                ></LikeOutlined>
                <span> {comment && comment.likeCount}</span>
              </>,
            ]}
            loading={loading}
          >
            <Card.Meta
              style={{ marginBottom: 10 }}
              avatar={
                <Avatar
                  src={comment && comment.user && getImageUrl(comment.user.avatarHd) }
                />
              }
              title={`@${comment && comment.user && comment.user.screenName}`}
              description={HtmlParser(comment && comment.text)}
            />
          </Card>
        </Col>
      </Row>
     <SubCommentList></SubCommentList>
    </>
  );
}

export default SubComments;
