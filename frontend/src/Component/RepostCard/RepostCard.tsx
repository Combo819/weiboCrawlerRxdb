import React, { useState } from "react";
import { Weibo } from "../../types";
import { Avatar, Card, Col, Row } from "antd";
import { PhotoConsumer, PhotoProvider } from "react-photo-view";
import HtmlParser from "react-html-parser";
import ReactPlayer from "react-player";
import { getImageUrl, getVideoUrl } from "../../Utility/parseUrl";
import _ from "lodash";
import {
  LikeOutlined,
  CommentOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
type RepostCardProps = {
  repostedWeibo: Weibo;
  loading: boolean;
  page?: string | null;
  pageSize?: string | null;
};

function RepostCard({
  repostedWeibo: weibo,
  loading,
  page,
  pageSize,
}: RepostCardProps) {
  const chunkImages: any[][] = _.chunk(weibo?.pics, 3);
  const history = useHistory();
  return (
    <Card
      actions={[
        <div
          onClick={() => {
            //history.push(`/comments/${weibo.id}?page=1&pageSize=10`,'hello')
            history.push({
              pathname: `/weibo/${weibo.id}/reposts`,
              search: `?page=1&pageSize=10`,
              state: { page, pageSize },
            });
          }}
        >
          <RetweetOutlined
            style={{ position: "relative", top: -3 }}
            key="repost"
          ></RetweetOutlined>
          <span>{weibo && weibo.repostsCount}</span>
        </div>,
        <div
          onClick={() => {
            //history.push(`/comments/${weibo.id}?page=1&pageSize=10`,'hello')
            history.push({
              pathname: `/comments/${weibo.id}`,
              search: `?page=1&pageSize=10`,
            });
          }}
        >
          <CommentOutlined
            style={{ position: "relative", top: -3 }}
            key="comment"
          ></CommentOutlined>
          <span>{weibo && weibo.commentsCount}</span>
        </div>,
        <div>
          <LikeOutlined
            style={{ position: "relative", top: -3 }}
            key="like"
          ></LikeOutlined>
          <span> {weibo && weibo.attitudesCount}</span>
        </div>,
      ]}
      loading={loading || false}
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
        title={
          <a
            target="_blank"
            href={`https://m.weibo.cn/u/${weibo?.user?.id}`}
          >{`@${weibo && weibo.user && weibo.user.screenName}`}</a>
        }
        description={HtmlParser(weibo && weibo.text)}
      />
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

export default RepostCard;
