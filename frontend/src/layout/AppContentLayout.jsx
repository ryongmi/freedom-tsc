import { Outlet } from "react-router-dom";
import AppSider from "./AppSider";
import { Layout, theme } from "antd";
import AppBreadcrumb from "./AppBreadcrumb";
import { Content } from "antd/es/layout/layout";
import "../styles/content.css";

function AppContentLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        height: "90vh",
      }}
    >
      <AppSider colorBgContainer={colorBgContainer} />
      <Layout
        style={{
          padding: "0 24px",
          height: "100%",
        }}
      >
        <AppBreadcrumb />
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            height: "100%",
            background: colorBgContainer,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppContentLayout;
