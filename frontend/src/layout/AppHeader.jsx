import { Avatar, Button, Col, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import Login from "../components/auth/Login";
import Logout from "../components/auth/Logout";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { LOGOUT_IMG } from "../config/imgUrl";
import { Modal } from "antd";
import { TWITCH_LOGIN_API } from "../config/apiUrl";

import "../styles/header.css";
import { logout } from "../services/apiUser";

function AppHeader({ collapsed, toggleCollapsed }) {
  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);
  const navigate = useNavigate();
  const [modal, contextModal] = Modal.useModal();

  function handleLogin(e) {
    e.preventDefault();
    window.location.href = TWITCH_LOGIN_API;
  }

  async function handleLogout(e) {
    e.preventDefault();

    try {
      await logout();
      window.location.replace("/");
    } catch (error) {
      modal.warning({ title: "로그아웃 에러", content: error.message });
    }
  }

  return (
    <>
      {contextModal}
      <Header className="header">
        {/* gutter : 컬럼 사이의 간격을 의미 */}
        <Row align="middle" gutter={16}>
          <Col style={{ marginRight: "52px" }}>
            {/* <img src={logo} style={{ height: 19, width: 16 }} alt="logo" /> */}
            <button className="btn-user-icon" onClick={(e) => navigate("/")}>
              <Avatar size="large" src={LOGOUT_IMG} />
            </button>
            <span>freedom</span>
          </Col>
          <Col flex={2}>
            <Button onClick={toggleCollapsed} ghost>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </Col>

          <Col>
            {isLoggedIn ? (
              <Logout handleLogout={handleLogout} />
            ) : (
              <Login handleLogin={handleLogin} />
            )}
          </Col>
          <Col>
            <UserMenu handleLogin={handleLogin} handleLogout={handleLogout} />
          </Col>
        </Row>
      </Header>
    </>
  );
}

export default AppHeader;

{
  /* <Col flex={2}>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            // placement="bottomLeft"
            // open={true}
          >
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                // position: "relative",
                // top: "-3px",
              }}
              onClick={(e) => e.preventDefault()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#f3f2f2"
                viewBox="0 0 256 256"
              >
                <path d="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z"></path>
              </svg>
            </button>
          </Dropdown>
        </Col> */
}
