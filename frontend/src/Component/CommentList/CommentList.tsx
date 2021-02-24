import React, { useEffect, useState, useRef } from "react";
import { Col, Row, List, Avatar, Pagination } from "antd";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { getCommentsApi } from "../../Api";
import HtmlParser from "react-html-parser";
import { LikeOutlined, PictureOutlined } from "@ant-design/icons";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import "react-photo-view/dist/index.css";
import { getImageUrl } from "../../Utility/parseUrl";
import { Comment } from "../../types";
export default function CommentList(props: React.Props<any>) {
  function useQuery() {
    const query = new URLSearchParams(useLocation().search);
    return { page: query.get("page"), pageSize: query.get("pageSize") };
  }
  let listRef = useRef<any>(null);
  const history = useHistory();
  const { pathname } = useLocation();
  const { weiboId } = useParams<{ weiboId: string }>();
  const { page: urlPage, pageSize: urlPageSize } = useQuery();
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalNumber, setTotalNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlPageSize);

  useEffect(() => {
    setLoading(true);
    getCommentsApi(weiboId, parseInt(page || "1"), parseInt(pageSize || "10"))
      .then((res) => {
        const { comments, totalNumber } = res.data;
        setComments(comments);
        setTotalNumber(totalNumber);
        setLoading(false);
      })
      .catch((err) => {});
  }, [weiboId, page, pageSize]);
  const onShowSizeChange = (currentPage: number, pageSize: number) => {
    const newPage = currentPage <= 0 ? 1 : currentPage;
    setPage(String(newPage));
    setPageSize(String(pageSize));
    history.push({
      pathname: pathname,
      search: `?page=${newPage}&pageSize=${pageSize}`,
    });
  };

  const changePage = (currentPage: number, pageSize: number | undefined) => {
    const newPage = currentPage <= 0 ? 1 : currentPage;
    setPage(String(newPage));
    setPageSize(String(pageSize));
    history.push({
      pathname: pathname,
      search: `?page=${newPage}&pageSize=${pageSize}`,
    });
    if (listRef && listRef.current) {
      listRef.current.scrollIntoView();
    }
  };
  const toSubComments = (commentId: string) => {
    history.push({
      pathname: `/comment/${commentId}`,
      search: `?page=1&pageSize=10`,
      state: { page, pageSize },
    });
  };

  const repliesStyle = (num: number) => {
    if (num > 0) {
      return { color: "#1890ff" };
    }
    return { cursor: "default" };
  };
  return (
    <>
      <Row justify="center">
        <Col ref={listRef} style={{ width: 600 }}>
          <List
            style={{ backgroundColor: "white" }}
            bordered
            split
            loading={loading}
            itemLayout="vertical"
            dataSource={comments || []}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <>
                    <span style={{ position: "relative", top: 5 }}>
                      {" "}
                      {item && item.likeCount}
                    </span>
                    <LikeOutlined key="like"></LikeOutlined>
                  </>,
                  <a
                    onClick={() => {
                      if (item.subComments.length > 0) {
                        toSubComments(item && item.id);
                      }
                    }}
                    key="list-loadmore-edit"
                    style={repliesStyle(item.subComments.length)}
                  >
                    {item.subComments.length} replies
                  </a>,
                  item.pic && (
                    <PhotoProvider>
                      <PhotoConsumer src={getImageUrl(item.pic.url)}>
                        <PictureOutlined
                          style={{ color: "#1890ff", cursor: "pointer" }}
                        />
                      </PhotoConsumer>
                    </PhotoProvider>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={item.user && getImageUrl(item.user.avatarHd)}
                    />
                  }
                  title={
                    <a target="_blank" href={item?.user?.profileUrl}>{`@${
                      item.user && item.user.screenName
                    }`}</a>
                  }
                  description={HtmlParser(item.text)}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col
          className="d-flex flex-row-reverse"
          xs={24}
          sm={20}
          md={12}
          lg={12}
          xl={8}
        >
          <Pagination
            onChange={changePage}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={parseInt(page || "1")}
            total={totalNumber}
            className="p-2"
            pageSize={parseInt(pageSize || "10")}
          ></Pagination>
        </Col>
      </Row>
    </>
  );
}
