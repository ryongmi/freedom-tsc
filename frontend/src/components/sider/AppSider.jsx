import React, { useState, useEffect } from "react";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { Layout, Menu } from "antd";

import { getMenuInfo } from "../../services/apiMenu";

import "../../styles/sider.css";

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

const userItems = [getItem("전체글보기", "/postAll")];
const adminItems = [getItem("대시보드", "/admin/dashBoard")];

function AppSider({ colorBgContainer, showModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useOutletContext();
  const { menu, adminFlag } = useLoaderData();
  const [menuItem, setMenuItem] = useState([]);
  const splitPath = location.pathname.split("/");
  let selectedMenu;
  if (splitPath[1] === "postAll") {
    selectedMenu = `/${splitPath[1]}`;
  } else if (splitPath.length > 2) {
    selectedMenu = `/${splitPath[1]}/${splitPath[2]}`;
  } else if (splitPath.length > 1) {
    selectedMenu = `/${splitPath[1]}`;
  } else {
    selectedMenu = `/`;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const items = [];
        if (adminFlag) items.push(...adminItems);
        else items.push(...userItems);

        for (let index = 0; index < menu.length; index++) {
          const topMenu = menu[index];
          if (topMenu.TOP_MENU_ID) continue;
          const { MENU_ID: topMenuId, MENU_NAME: topMenuName } = topMenu;

          const aryMiddleItem = [];
          for (
            let middleIndex = index + 1;
            middleIndex < menu.length;
            middleIndex++
          ) {
            const middleMenu = menu[middleIndex];
            if (!middleMenu.TOP_MENU_ID) break;
            const { MENU_NAME: middleMenuName, URL: middleMenuUrl } =
              middleMenu;
            aryMiddleItem.push(getItem(middleMenuName, middleMenuUrl));
          }

          items.push(
            getItem(
              topMenuName,
              topMenuId,
              // <UserOutlined />,
              null,
              aryMiddleItem.length === 0 ? null : aryMiddleItem
            )
          );
        }

        setMenuItem([...items]);
      } catch (error) {
        showModal("서버 에러", "메뉴를 가져오지 못했습니다.");
      }
    }
    fetchData();
  }, [menu, adminFlag]);

  function menuItemClick({ item, key, keyPath, selectedKeys }) {
    // console.log("item: " + item);
    // console.log("key: " + key);
    // console.log("keyPath: " + keyPath);
    // console.log("selectedKeys: " + selectedKeys);
    navigate(key);
  }

  return (
    <Sider
      // width={300}
      className="side-bar scroll"
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
        //defaultSelectedKeys={["1"]} // 기본으로 선택할 키 설정
        // defaultOpenKeys={[`/${splitPath[1]}`]} // 기본으로 열려있는 키 설정
        // onSelect={menuItemClick}
        selectedKeys={[selectedMenu]}
        onClick={menuItemClick}
        items={menuItem}
      />
    </Sider>
  );
}

export async function userLoader() {
  try {
    const data = await getMenuInfo(false);
    return data;
  } catch (error) {
    console.log("error: " + error);
  }
}

export async function adminLoader() {
  try {
    const data = await getMenuInfo(true);
    return data;
  } catch (error) {
    console.log("error: " + error);
  }
}

export default AppSider;
