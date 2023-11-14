import {
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Flex,
  List,
  Radio,
  Space,
  Tag,
} from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { patchChangeNotice } from "../../services/apiPost";
import { useState } from "react";

function PostTitle({
  menuId,
  postId,
  menuName,
  notice,
  bracket,
  title,
  createdUser,
  createdAt,
  authName,
  profileImgUrl,
  noticeValue,
  commentLength,
  handleSearch,
  setNoticeValue,
  comboNotice,
}) {
  const navigate = useNavigate();
  const { adminFlag } = useSelector((store) => store.user);
  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  const postItems = [
    {
      key: "0",
      label: "공지등록",
    },
  ];

  if (notice) {
    postItems.push({
      key: "1",
      label: "공지내리기",
    });
  }

  // 공지등록 Radio버튼 체인지 이벤트
  const onNoticeChange = (e) => {
    setNoticeValue(e.target.value);
  };

  // 공지 등록 및 변경
  async function handleChangePostNotice(e) {
    try {
      const fetchData = {
        menuId,
        postId,
        notice: noticeValue,
      };
      const { message } = await patchChangeNotice(fetchData);
      setDrawerOpen(false);
      await handleSearch();
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    }
  }

  // 공지 내리기
  async function handleCloseNotice() {
    try {
      const fetchData = {
        menuId,
        postId,
        notice: null,
      };
      const { message } = await patchChangeNotice(fetchData);
      await handleSearch();
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    }
  }

  // 게시글 더보기 메뉴 이벤트
  function handlePostMenuClick(e) {
    switch (e.key) {
      case "0":
        showDrawer();
        break;
      case "1":
        handleCloseNotice();
        break;
      default:
        break;
    }
  }

  // Drawer 화면 Open 이벤트
  const showDrawer = () => {
    setDrawerOpen(true);
  };

  // Drawer 화면 Close 이벤트
  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Col span={24} style={{ borderBottom: "1px solid" }}>
      <div>
        <p>
          <a
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={(e) => navigate(`/post/${menuId}`)}
          >
            <strong>{menuName}</strong>
            <span style={{ display: "flex" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                width="25"
                height="20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </a>
        </p>
        <h2 style={{ margin: "0" }}>
          {notice && (
            <Tag color="#f50">{notice === "MUST_READ" ? "필독" : "공지"}</Tag>
          )}
          {bracket && `[${bracket}]`} {title}
        </h2>
      </div>
      <List
        dataSource={[
          {
            user: createdUser,
            date: createdAt,
            auth: authName,
          },
        ]}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <a>
                  <Avatar size={50} src={profileImgUrl} />
                </a>
              }
              title={
                <span style={{ fontWeight: "500" }}>
                  <a className="user-name">{item.user}</a>
                  &nbsp;{item.auth}
                </span>
              }
              description={item.date}
            />
            <div>
              <Flex align={"center"} gap={10}>
                <a
                  href="#comment"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="28"
                    height="22"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>댓글</span>
                  <strong>&nbsp;{commentLength}</strong>
                </a>
                {adminFlag === "Y" && (
                  <Dropdown
                    menu={{
                      items: postItems,
                      onClick: handlePostMenuClick,
                    }}
                    trigger={["click"]}
                  >
                    <a
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="28"
                        fill="#d0cfcf"
                        viewBox="0 0 256 256"
                      >
                        <path d="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z"></path>
                      </svg>
                    </a>
                  </Dropdown>
                )}
              </Flex>
            </div>
          </List.Item>
        )}
      />

      <Drawer
        title="공지 등록"
        width={350}
        onClose={onDrawerClose}
        open={drawerOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Radio.Group
          onChange={onNoticeChange}
          value={noticeValue}
          style={{ width: "100%", padding: "0 15px 15px" }}
        >
          <Space direction="vertical">
            {comboNotice.map((notice) => {
              return <Radio value={notice.value}>{notice.label}</Radio>;
            })}
          </Space>
        </Radio.Group>
        <Space size={"middle"} style={{ width: "100%", padding: "5px" }}>
          <Button className="btn-notice" onClick={onDrawerClose}>
            취소
          </Button>
          <Button onClick={handleChangePostNotice} type="primary">
            저장
          </Button>
        </Space>
      </Drawer>
    </Col>
  );
}

export default PostTitle;
