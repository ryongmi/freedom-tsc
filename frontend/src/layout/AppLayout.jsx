// import Logo from "./Logo";
import { Outlet, useLocation } from "react-router-dom";
import { Layout, theme } from "antd";
import { useState } from "react";

import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import AppBreadcrumb from "./AppBreadcrumb";
const { Content } = Layout;

function AppLayout() {
  // const location = useLocation();
  // console.log(location);
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <AppHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <Layout>
        <AppSider collapsed={collapsed} />
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <AppBreadcrumb />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
