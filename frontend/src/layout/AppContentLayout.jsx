import { Outlet } from "react-router-dom";
import { Layout, Modal, message, theme } from "antd";
import { Content } from "antd/es/layout/layout";

import AppSider from "../components/sider/AppSider";

import "../styles/content.css";

function AppContentLayout() {
  const [messageApi, contextMessage] = message.useMessage();
  const [modal, contextModal] = Modal.useModal();

  const showMessage = (content, type = "success", duration = 3) => {
    messageApi.open({
      type,
      content,
      duration,
    });
  };

  const setModalConfig = (title, content) => {
    return {
      title,
      content,
    };
  };

  const showModal = (title, content) => {
    modal.warning(setModalConfig(title, content));
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Layout>
        <AppSider colorBgContainer={colorBgContainer} showModal={showModal} />
        <Layout className="content-container">
          {contextMessage}
          {contextModal}
          <Content
            className="scroll content"
            style={{
              background: colorBgContainer,
            }}
          >
            <Outlet context={{ showMessage, showModal }} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default AppContentLayout;
