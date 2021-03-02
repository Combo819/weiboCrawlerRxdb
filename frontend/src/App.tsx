import React, { useState, useEffect } from "react";
import "./App.css";
import { Layout, Menu, Button, Dropdown, BackTop, Empty } from "antd";
import { Switch, Route } from "react-router-dom";
import { routes } from "./Routes";
import { SaveWeiboModal } from "./Component/Modal";
import { DownOutlined, UpCircleOutlined } from "@ant-design/icons";
import { getMonitorUsersApi } from "./Api";

const { Header, Content } = Layout;
function App(): JSX.Element {
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [users, setUsers] = useState(new Array(0).fill(""));
  useEffect(() => {
    getMonitorUsersApi().then((res) => {
      const { users }: { users: string[] } = res.data;
      setUsers(users);
    });
  }, []);
  const menu =
    users?.length > 0 ? (
      <Menu>
        {users.map((item) => (
          <Menu.Item>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://weibo.com/n/${item}`}
            >
              @{item}
            </a>
          </Menu.Item>
        ))}
      </Menu>
    ) : (
      <Menu>
        <Menu.Item disabled>
          <div>No User</div>
        </Menu.Item>
      </Menu>
    );

  return (
    <Layout>
      <Header
        style={{
          background: "white",
        }}
      >
        <Menu mode="horizontal">
          <Menu.Item key="1">
            <Button
              onClick={() => {
                setSaveModalVisible(true);
              }}
            >
              save
            </Button>
          </Menu.Item>
          <Menu.Item key="2">
            <Dropdown trigger={["click"]} overlay={menu}>
              <Button onClick={(e) => e.preventDefault()}>
                Monitor <DownOutlined />
              </Button>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Switch>
          {routes.map(
            (item): React.ReactNode => {
              return (
                <Route
                  path={item.path}
                  render={(props: any) => (
                    <item.component {...props}></item.component>
                  )}
                ></Route>
              );
            }
          )}
        </Switch>
      </Content>
      <SaveWeiboModal
        visible={isSaveModalVisible}
        closeModal={() => {
          setSaveModalVisible(false);
        }}
      ></SaveWeiboModal>
      <BackTop>
        <UpCircleOutlined
          style={{ fontSize: 30, color: "rgba(0, 0, 0, 0.45)" }}
        />
      </BackTop>
    </Layout>
  );
}

export default App;
