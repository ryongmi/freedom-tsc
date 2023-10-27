import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PieChartOutlined,
  DesktopOutlined,
} from "@ant-design/icons";

import { getMenuInfo } from "../services/apiMenu";

const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// const items = [
//   getItem("Option 1", "1", <PieChartOutlined />),
//   getItem(<Link to="/admin">admin</Link>, "2", <DesktopOutlined />),
//   getItem("tttt", "3", <NotificationOutlined />, [
//     getItem(<Link to="/">Home</Link>, "123"),
//   ]),
//   getItem("Navigation One", "sub1", <UserOutlined />, [
//     getItem(<Link to="/test1">test1</Link>, "5"),
//     getItem("Option 6", "6"),
//     getItem("Option 7", "7"),
//     getItem("Option 8", "8"),
//   ]),
//   getItem("Navigation Two", "sub2", <LaptopOutlined />, [
//     getItem("Option 9", "9"),
//     getItem("Option 10", "10"),
//     getItem("Submenu", "sub3", null, [
//       getItem("Option 11", "11"),
//       getItem("Option 12", "12"),
//     ]),
//   ]),
// ];

const items3 = [
  getItem("Home", "/"),
  getItem("admin", "/admin", <DesktopOutlined />),
];
const items2 = [
  getItem("Option 1", "1", <PieChartOutlined />),
  // getItem("admin", "/admin", <DesktopOutlined />),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("tttt", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1", "/test1"),
  ]),
  getItem("ttttddddddddddddddddddddd", "3", <NotificationOutlined />, [
    getItem("Home", "/"),
    getItem("test1dddddddddddddddddddddd", "/test1"),
  ]),
  getItem("admin", "/admin", <DesktopOutlined />),
];

function AppSider({ colorBgContainer }) {
  const navigate = useNavigate();
  const collapsed = useOutletContext();
  const [menuItem, setMenuId] = useState([]);
  const menu = useLoaderData();

  useEffect(() => {
    async function fetchData() {
      try {
        const items = [];
        for (let index = 0; index < menu.length; index++) {
          const topMenu = menu[index];
          if (topMenu.TOP_MENU_ID) continue;
          const {
            MENU_ID: topMenuId,
            MENU_NAME: topMenuName,
            URL: topMenuUrl,
          } = topMenu;

          const aryMiddleItem = [];
          for (
            let middleIndex = index + 1;
            middleIndex < menu.length;
            middleIndex++
          ) {
            const middleMenu = menu[middleIndex];
            if (!middleMenu.TOP_MENU_ID) break;
            const {
              MENU_ID: middleMenuId,
              MENU_NAME: middleMenuName,
              URL: middleMenuUrl,
            } = middleMenu;
            aryMiddleItem.push(getItem(middleMenuName, middleMenuId));
          }

          if (aryMiddleItem.length > 0)
            items.push(
              getItem(
                topMenuName,
                topMenuId.toString(),
                <UserOutlined />,
                aryMiddleItem
              )
            );
          else
            items.push(
              getItem(topMenuName, topMenuId.toString(), <UserOutlined />)
            );
        }

        setMenuId([...items]);
        // if (items.length > 0) setMenuId([...items]);
        // else setMenuId([...items2]);
      } catch (error) {
        console.log("error: " + error);
      }
    }
    fetchData();
  }, [menu]);

  function menuItemClick({ item, key, keyPath, selectedKeys }) {
    console.log("item: " + item);
    console.log("key: " + key);
    console.log("keyPath: " + keyPath);
    console.log("selectedKeys: " + selectedKeys);
    navigate(key);
  }

  return (
    <Sider
      // width={300}
      className="sideBar scroll"
      style={{
        background: colorBgContainer,
      }}
      collapsible={true}
      collapsed={collapsed}
      collapsedWidth={0}
      trigger={null}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]} // 기본으로 선택할 키 설정
        defaultOpenKeys={["sub1"]} // 기본으로 열려있는 키 설정
        onSelect={menuItemClick}
        style={{
          width: "100%",
          height: "100%",
          borderRight: 0,
          // whiteSpace: "normal",
        }}
        items={menuItem}
      />
    </Sider>
  );
}

export async function userLoader() {
  try {
    console.log("user");
    const { menu } = await getMenuInfo(false);
    return menu;
  } catch (error) {
    console.log("error: " + error);
  }
}

export async function adminLoader() {
  try {
    console.log("admin");
    const { menu } = await getMenuInfo(true);
    return menu;
  } catch (error) {
    console.log("error: " + error);
  }
}

export default AppSider;
