import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown, Avatar } from "antd";
import { LOGOUT_IMG } from "../config/imgUrl";

function UserMenu({ handleLogin, handleLogout }) {
  const { profileImgUrl, isLoggedIn } = useSelector((store) => store.user);

  const items = [
    {
      label: <Link to="/test1">Test1</Link>,
      key: "0",
    },
    {
      label: <Link to="/test2">Test2</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item（disabled）",
      key: "3",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      danger: true,
      label: isLoggedIn ? (
        <a onClick={handleLogout}>로그아웃</a>
      ) : (
        <a onClick={handleLogin}>로그인</a>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <button className="btn-user-icon" onClick={(e) => e.preventDefault()}>
        <Avatar size="large" src={isLoggedIn ? profileImgUrl : LOGOUT_IMG} />
      </button>
    </Dropdown>
  );
}

export default UserMenu;
