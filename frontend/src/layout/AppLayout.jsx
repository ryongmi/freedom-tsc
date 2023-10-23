// import Logo from "./Logo";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useState } from "react";

import AppHeader from "./AppHeader";
import { Footer } from "antd/es/layout/layout";

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <AppHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <Outlet context={collapsed} />
      <Footer>footer</Footer>
    </Layout>
  );
}

export default AppLayout;
