// import Logo from "./Logo";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Footer } from "antd/es/layout/layout";

import AppHeader from "./AppHeader";

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <AppHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <Outlet context={collapsed} />
      {/* <Footer>footer</Footer> */}
    </Layout>
  );
}

export default AppLayout;
