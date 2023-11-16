import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Dropdown, Avatar } from "antd";

function UserMenu({ handleLogin, handleLogout }) {
  const { adminFlag, profileImgUrl, isLoggedIn } = useSelector(
    (store) => store.user
  );
  const location = useLocation();
  const splitPath = location.pathname.split("/");
  const items = [
    {
      // label: <Link to="/test1">내 정보보기</Link>,
      label: "내 정보보기(준비중)",
      key: "0",
      disabled: true,
    },
  ];

  if (adminFlag === "Y") {
    items.push(
      {
        type: "divider",
      },
      {
        label:
          splitPath[1] === "admin" ? (
            <Link to="/">카페로 돌아가기</Link>
          ) : (
            <Link to="/admin/dashBoard">관리자페이지</Link>
          ),
        key: "3",
      }
    );
  }

  items.push(
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
    }
  );

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <button className="btn-user-icon" onClick={(e) => e.preventDefault()}>
        <Avatar
          size="large"
          src={
            isLoggedIn ? (
              profileImgUrl
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                width={35}
                height={35}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )
          }
        />
      </button>
    </Dropdown>
  );
}

export default UserMenu;
