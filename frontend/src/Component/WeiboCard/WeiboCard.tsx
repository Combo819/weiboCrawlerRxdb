import React from "react";
import { Card, Avatar, Row, Col } from "antd";
import { LikeOutlined, CommentOutlined, RetweetOutlined } from "@ant-design/icons";
import _ from "lodash";
import HtmlParser from "react-html-parser";
import ReactPlayer from "react-player";
import "react-medium-image-zoom/dist/styles.css";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import "react-photo-view/dist/index.css";
import { Route, useHistory, Switch } from "react-router-dom";
import { getVideoUrl, getImageUrl } from "../../Utility/parseUrl";
import { Weibo } from "../../types";
import RepostCard from "../RepostCard/RepostCard";

type CardProps = {
  weibo: Weibo;
  isWeiboContent: boolean;
  page?: string | null;
  pageSize?: string | null;
  loading?: boolean;
};



export default function WeiboCard(props: CardProps) {
  const { weibo, loading, page, pageSize, isWeiboContent } = props;
  const chunkImages: any[][] = _.chunk(weibo?.pics, 3);
  const history = useHistory();

  const actionItemForWeiboList = [
    <div onClick={() => {
      //history.push(`/comments/${weibo.id}?page=1&pageSize=10`,'hello')
      history.push({
        pathname: `/weibo/${weibo.id}/reposts`,
        search: `?page=1&pageSize=10`,
        state: { page, pageSize },
      });
    }}>
      <Switch>
        <Route path="/weibo/:weiboId/comments">
          <RetweetOutlined style={{ position: "relative", top: -3 }}
            key="repost" >
          </RetweetOutlined>
          <span>{weibo && weibo.repostsCount}</span>
        </Route>
        <Route path="/weibo/:weiboId/reposts">
          <RetweetOutlined style={{ position: "relative", top: -3, color: '#1890ff' }}
            key="repost" >
          </RetweetOutlined>
          <span style={{ color: '#1890ff' }}>{weibo && weibo.repostsCount}</span>
        </Route>
      </Switch>
    </div>
    , (
      <div
        onClick={() => {
          //history.push(`/comments/${weibo.id}?page=1&pageSize=10`,'hello')
          history.push({
            pathname: `/weibo/${weibo.id}/comments`,
            search: `?page=1&pageSize=10`,
            state: { page, pageSize },
          });
        }}
      >
        <Route path="/weibo/:weiboId/comments">
          <CommentOutlined
            style={{ position: "relative", top: -3, color: '#1890ff' }}
            key="comment"
          ></CommentOutlined>
          <span style={{ color: '#1890ff' }} >{weibo && weibo.commentsCount}</span>
        </Route>
        <Route path="/weibo/:weiboId/reposts">
          <CommentOutlined
            style={{ position: "relative", top: -3, }}
            key="comment"
          ></CommentOutlined>
          <span >{weibo && weibo.commentsCount}</span>
        </Route>

      </div>
    ),
    <div>
      <LikeOutlined
        style={{ position: "relative", top: -3 }}
        key="like"
      ></LikeOutlined>
      <span> {weibo && weibo.attitudesCount}</span>
    </div>,
  ]

  return (
    <Card
      loading={loading || false}
      actions={actionItemForWeiboList}
      style={{ width: "100%" }}
    >
      {" "}
      <Card.Meta
        style={{ marginBottom: 10 }}
        avatar={
          <Avatar
            src={weibo && weibo.user && getImageUrl(weibo.user.avatarHd)}
          />
        }
        title={<a target='_blank' href={`https://m.weibo.cn/u/${weibo?.user?.id}`}>{`@${weibo && weibo.user && weibo.user.screenName}`}</a>}
        description={HtmlParser(weibo && weibo.text)}
      />
      {weibo?.repostingId && (
        <RepostCard
          loading={loading || false}
          repostedWeibo={weibo?.reposting as Weibo}
        />
      )}
      {weibo && weibo.pics && (
        <Row justify="center" align="middle">
          <Col>
            <PhotoProvider>
              {chunkImages.map((item) => (
                <Row gutter={[8, 8]} justify="center">
                  {item.map((ele) => (
                    <Col key={ele.url} style={{ overflow: "hidden" }} span={8}>
                      <PhotoConsumer
                        key={getImageUrl(ele.url)}
                        intro={getImageUrl(ele.url)}
                        src={getImageUrl(ele.url)}
                      >
                        <img
                          className="img-thumbnail"
                          style={{
                            height: 150,
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={getImageUrl(ele.url)}
                        ></img>
                      </PhotoConsumer>
                    </Col>
                  ))}
                </Row>
              ))}
            </PhotoProvider>
          </Col>
        </Row>
      )}
      {weibo && weibo.pageInfo && weibo.pageInfo.urls && (
        <Row justify="center">
          <Col>
            <ReactPlayer
              type="video/mp4"
              width={"100%"}
              url={getVideoUrl(weibo && weibo.pageInfo.url)}
              controls={true}
            />
          </Col>
        </Row>
      )}
    </Card>
  );
}
