import { Dropdown, Avatar } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function UserMenu() {
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
      label: isLoggedIn ? "로그아웃" : "로그인",
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
      placement="bottomLeft"
      style={{ cursor: "pointer" }}
      // open={true}
    >
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
          src={
            isLoggedIn
              ? profileImgUrl
              : "https://static-cdn.jtvnw.net/jtv_user_pictures/959a3937-f979-43d9-bbaf-2eb2c31a3102-profile_image-50x50.png"
          }
        />
      </button>
    </Dropdown>
  );
}

export default UserMenu;
