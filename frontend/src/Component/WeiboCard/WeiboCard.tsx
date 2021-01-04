import React  from "react";
import { Card, Avatar, Row, Col } from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";
import _ from "lodash";
import HtmlParser from "react-html-parser";
import ReactPlayer from "react-player";
import "react-medium-image-zoom/dist/styles.css";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import "react-photo-view/dist/index.css";
import {useHistory} from 'react-router-dom';
import {getVideoUrl,getImageUrl} from '../../Utility/parseUrl'

type CardProps = {
  weibo: any;
  isCommentsPage:boolean;
  page?:string|null;
  pageSize?:string|null;
  loading?: boolean;
};



export default function WeiboCard(props: CardProps) {
  const { weibo={}, loading,page,pageSize,isCommentsPage } = props;
  const chunkImages: any[][] = _.chunk(weibo&&weibo.pics, 3);
  const history = useHistory();
  return (
    <Card
      loading={loading || false}
      actions={[
        !isCommentsPage&&<div onClick={()=>{
          //history.push(`/comments/${weibo.id}?page=1&pageSize=10`,'hello')
          history.push({pathname:`/comments/${weibo.id}`,search:`?page=1&pageSize=10`,state:{page,pageSize}})
        }}>
          <CommentOutlined
            style={{ position: "relative", top: -3 }}
            key="comment"
          ></CommentOutlined>
          <span>{weibo&&weibo.commentsCount}</span>
        </div>,
        <div>
          <LikeOutlined
            style={{ position: "relative", top: -3 }}
            key="like"
          ></LikeOutlined>
          <span> {weibo&&weibo.attitudesCount}</span>
        </div>,
      ]}
      style={{ width: '100%' }}
    >
      {" "}
      <Card.Meta
        style={{ marginBottom: 10 }}
        avatar={<Avatar src={weibo&&weibo.user && getImageUrl(weibo.user.avatarHd) } />}
        title={`@${weibo&&weibo.user && weibo.user.screenName}`}
        description={HtmlParser(weibo&&weibo.text)}
      />
      {weibo&&weibo.pics && (
        <Row justify="center" align='middle'>
          <Col>
            <PhotoProvider>
              {chunkImages.map((item) => (
                <Row gutter={[8, 8]} justify="center">
                  {item.map((ele) => (
                    <Col
                      key={ele.url}
                      style={{ overflow: "hidden" }}
                      span={8}
                    >
                      <PhotoConsumer
                        key={getImageUrl(ele.url)}
                        intro={getImageUrl(ele.url)}
                        src={getImageUrl(ele.url)}
                      >
                        <img
                          className="img-thumbnail"
                          style={{
                            height: 150,
                            width: '100%',
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
      {weibo&&weibo.pageInfo&&weibo.pageInfo.urls && (
        <Row justify="center">
          <Col>
            <ReactPlayer
              type="video/mp4"
             
              width={"100%"}
              url={getVideoUrl(weibo&&weibo.pageInfo.url)}
              controls={true}
            />
          </Col>
        </Row>
      )}
    </Card>
  );
}
