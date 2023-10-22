import { Avatar, Col, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import Login from "../components/Login";
import Logout from "../components/Logout";
import AppButton from "./AppButton";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

function AppHeader({ collapsed, toggleCollapsed }) {
  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);

  return (
    <Header
      style={{
        color: "white",
      }}
    >
      {/* gutter : 컬럼 사이의 간격을 의미 */}
      <Row align="middle" gutter={12} style={{ margin: "0px -15px" }}>
        <Col style={{ marginRight: "52px" }}>
          {/* <img src={logo} style={{ height: 19, width: 16 }} alt="logo" /> */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              top: "-3px",
            }}
            onClick={(e) => e.preventDefault()}
          >
            <Avatar
              size="large"
              src="https://static-cdn.jtvnw.net/jtv_user_pictures/959a3937-f979-43d9-bbaf-2eb2c31a3102-profile_image-50x50.png"
            />
          </button>
          <span>freedom</span>
        </Col>
        <Col flex={2}>
          <AppButton
            onClick={toggleCollapsed}
            ghost={true}
            // style={{
            //   marginBottom: 16,
            // }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </AppButton>
        </Col>

        <Col>
          <Link to="/test1">test1</Link>
        </Col>
        <Col>
          <Link to="/test2">test2</Link>
        </Col>
        <Col
        // style={{ textAlign: "right", marginLeft: 25 }}
        >
          Welcome John Cena
        </Col>
        <Col>{isLoggedIn ? <Logout /> : <Login />}</Col>
        <Col>
          <UserMenu />
        </Col>
      </Row>
    </Header>
  );
}

export default AppHeader;
