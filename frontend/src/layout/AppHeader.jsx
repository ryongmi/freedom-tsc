import { Avatar, Button, Col, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import Login from "../components/Login";
import Logout from "../components/Logout";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

function AppHeader({ collapsed, toggleCollapsed }) {
  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        // display: "flex",
        // alignItems: "center",
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
          <Button
            onClick={toggleCollapsed}
            ghost
            // style={{
            //   marginBottom: 16,
            // }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </Col>

        <Col>
          <Link to="/">Home</Link>
        </Col>
        <Col>
          <Link to="/admin/manageMenu">Admin</Link>
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
