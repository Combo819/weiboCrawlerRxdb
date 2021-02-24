import React, { useEffect, useState, useRef } from "react";
import { Col, Row, List, Avatar, Pagination } from "antd";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { getRepostCommentsApi } from "../../Api";
import HtmlParser from "react-html-parser";
import "react-photo-view/dist/index.css";
import { getImageUrl } from "../../Utility/parseUrl";
import { RepostComment } from "../../types";
export default function RepostCommentList(props: React.Props<any>) {
  function useQuery() {
    const query = new URLSearchParams(useLocation().search);
    return { page: query.get("page"), pageSize: query.get("pageSize") };
  }
  let listRef = useRef<any>(null);
  const history = useHistory();
  const { pathname } = useLocation();
  const { weiboId } = useParams<{ weiboId: string }>();
  const { page: urlPage, pageSize: urlPageSize } = useQuery();
  const [repostComments, setRepostComments] = useState<RepostComment[]>([]);
  const [totalNumber, setTotalNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlPageSize);

  useEffect(() => {
    setLoading(true);
    getRepostCommentsApi(
      weiboId,
      parseInt(page || "1"),
      parseInt(pageSize || "10")
    )
      .then((res) => {
        const { repostComments, totalNumber } = res.data;
        setRepostComments(repostComments);
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
  return (
    <>
      <Row justify="center">
        <Col ref={listRef} style={{ width: 600 }}>
          <List<RepostComment>
            style={{ backgroundColor: "white" }}
            bordered
            split
            loading={loading}
            itemLayout="vertical"
            dataSource={repostComments || []}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={item.user && getImageUrl(item.user.avatarHd)}
                    />
                  }
                  title={
                    <a target="_blank" href={item.user.profileUrl}>{`@${
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
            defaultCurrent={parseInt(page || "1")}
            total={totalNumber}
            className="p-2"
          ></Pagination>
        </Col>
      </Row>
    </>
  );
}
