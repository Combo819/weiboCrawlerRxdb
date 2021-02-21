import React, { useEffect, useState,useRef } from "react";
import { Col, Row, Pagination,Empty } from "antd";
import { WeiboCard } from "../../Component/WeiboCard";
import { getWeibosApi } from "../../Api";
import { useLocation,useHistory } from "react-router-dom";
import { Weibo as WeiboType } from "../../types";

function Weibo(Props: React.Props<any>) {
  let listRef = useRef<any>(null)
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const history = useHistory();
  const query = useQuery();
  const [weibos, setWeibos] = useState<WeiboType[]>([]);
  const [page, setPage] = useState(query.get("page"));
  const [pageSize, setPageSize] = useState(query.get("pageSize"));
  const [totalNumber,setTotalNumber] = useState(0);
  useEffect(() => {
    getWeibosApi(parseInt(page || "1"), parseInt(pageSize || "10"))
      .then((res) => {
        const { weibo,totalNumber } = res.data;
        setWeibos(weibo);
        setTotalNumber(totalNumber);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page,pageSize]);

  const onShowSizeChange = (currentPage: number, pageSize: number) => {
    const newPage = currentPage<=0?1:currentPage;
    setPage(String(newPage));
    setPageSize(String(pageSize));
    history.push({pathname:'/',search:`?page=${newPage}&pageSize=${pageSize}`})
  };

  return (
    <>
      <Row justify="center" align="middle">
        <Col ref={listRef}  xs={24} sm={20} md={12} lg={12} xl={8}> 
          {weibos.length>0?weibos.map((item: any) => {
            return (
              <Row className={"mt-3"} key={item.id}>
                <Col>
                  <WeiboCard
                    isCommentsPage={false}
                    page={page}
                    pageSize={pageSize}
                    weibo={item}
                  ></WeiboCard>
                </Col>
              </Row>
            );
          }):<Empty />}
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col className="d-flex flex-row-reverse" xs={24} sm={20} md={12} lg={12} xl={8}>
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            defaultCurrent={parseInt(page||'1')}
            total={totalNumber}
            className="p-2"
          ></Pagination>
        </Col>
      </Row>
    </>
  );
}

export default Weibo;
