import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Flex,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import {
  getPostContent,
  patchChangeNotice,
  patchMovePost,
  patchPost,
} from "../../services/apiPost";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import ReplyComment from "../../components/post/ReplyComment";
import "../../styles/post.css";
import "../../styles/comment.css";
import { getComment, patchComment } from "../../services/apiComment";
import { useSelector } from "react-redux";
import { iframeRegex } from "../../utils/iframeRegex";

const commentItems = [
  {
    key: "0",
    label: "수정",
  },
  {
    key: "1",
    danger: true,
    label: "삭제",
  },
];

function PostContent() {
  const { showMessage, showModal } = useOutletContext();
  const { adminFlag } = useSelector((store) => store.user);
  const { menuId, postId } = useParams();
  const navigate = useNavigate();

  // combo
  const [comboNotice, setComboNotice] = useState([]);
  const [noticeValue, setNoticeValue] = useState([]);
  const [comboMenu, setComboMenu] = useState([]);
  const [comboBracket, setComboBracket] = useState([]);
  const [comboMenuAtBracket, setComboMenuAtBracket] = useState([]);
  const [changeMenu, setChangeMenu] = useState(null);
  const [changeBracket, setChangeBracket] = useState(null);

  // 게시글
  const [post, setPost] = useState({});
  const {
    menuName,
    bracket,
    notice,
    title,
    authName,
    content,
    profileImgUrl,
    createdAt,
    createdUser,
    writer,
    prevPostId,
    nextPostId,
    prevMenuId,
    nextMenuId,
  } = { ...post, content: iframeRegex(post?.content ?? "") };

  // 댓글
  const [commentData, setCommentData] = useState([]);
  const [openReplyComment, setOpenReplyComment] = useState(null);
  const [updateComment, setUpdateComment] = useState(null);

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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

  useEffect(() => {
    async function fetchData() {
      await handleSearch();
    }
    fetchData();
  }, [menuId, postId]);

  // 전체 조회 이벤트
  async function handleSearch() {
    try {
      const { post, comments, comboBracket, comboMenu, comboNoticeOption } =
        await getPostContent(menuId, postId);

      setPost(post);
      setCommentData(comments);
      setComboNotice(comboNoticeOption);
      setNoticeValue(post.notice ?? comboNoticeOption[0].value);

      setComboBracket(comboBracket);
      setComboMenu(comboMenu);

      if (post?.menuId ?? null)
        setComboMenuAtBracket(
          comboBracket.filter((item) => item.menuId === post.menuId)
        );

      setChangeMenu(post.menuId);
      setChangeBracket(post.bracketId);
    } catch (error) {
      console.log(error);
    }
  }

  // 댓글 조회 - 댓글 변경시 실행됨
  async function handleSearchComment(e) {
    try {
      const { comments } = await getComment(menuId, postId);
      setCommentData(comments);
      setOpenReplyComment(null);
      setUpdateComment(null);
    } catch (error) {
      console.log(error);
    }
  }

  // 게시글 삭제
  async function handleDeletePost() {
    try {
      const fetchData = [
        {
          postId,
          menuId,
        },
      ];
      const { message } = await patchPost(fetchData);
      navigate(-1);
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    }
  }

  // 이전글
  async function handleNextPost() {
    try {
      navigate(`/post/${nextMenuId}/${nextPostId}`);
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    }
  }

  // 다음글
  async function handlePrevPost() {
    try {
      navigate(`/post/${prevMenuId}/${prevPostId}`);
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    }
  }

  // 댓글 삭제
  async function handleDeleteComment(commentId) {
    try {
      const { message } = await patchComment(commentId);
      await handleSearchComment();
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    }
  }

  function handleCommentCancel(e) {
    setOpenReplyComment(null);
    setUpdateComment(null);
  }

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

  // 댓글 더보기 메뉴 이벤트
  function handleCommentMenuClick(e, item) {
    switch (e.key) {
      case "0":
        setOpenReplyComment(null);
        setUpdateComment(item.commentId);
        break;
      case "1":
        handleDeleteComment(item.commentId);
        break;
      default:
        break;
    }
  }

  // 공지등록 Radio버튼 체인지 이벤트
  const onNoticeChange = (e) => {
    setNoticeValue(e.target.value);
  };

  // Drawer 화면 Open 이벤트
  const showDrawer = () => {
    setDrawerOpen(true);
  };

  // Drawer 화면 Close 이벤트
  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  // 게시글 이동 팝업 - 메뉴 변경 이벤트
  function handleMenuChange(value) {
    setChangeMenu(value);
    setChangeBracket(null);
    setComboMenuAtBracket(comboBracket.filter((item) => item.menuId === value));
  }

  const showMovePostModal = () => {
    setModalOpen(true);
  };

  // 팝업 ok 클릭 이벤트
  async function handleOk() {
    if (!changeMenu) {
      showModal("데이터 미입력", "게시판을 선택해주세요.");
      return;
    }

    setConfirmLoading(true);

    try {
      const fetchData = [
        {
          menuId,
          postId,
          changeMenu,
          changeBracket,
        },
      ];
      const { message } = await patchMovePost(fetchData);

      setModalOpen(false);
      navigate(`/post/${changeMenu}/${postId}`);
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    } finally {
      setConfirmLoading(false);
    }
  }

  // 팝업 cancel 클릭 이벤트
  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div id="post-content">
      <Row gutter={[16, 0]}>
        <Col
          span={24}
          style={{ padding: "8px 0px", borderBottom: "1px solid" }}
        >
          <Flex justify={"space-between"} align={"center"}>
            <Flex align={"center"} gap={10}>
              {writer !== "TRUE" && adminFlag !== "Y" && <div></div>}
              {adminFlag === "Y" && (
                <>
                  <Button type="primary" onClick={showMovePostModal}>
                    이동
                  </Button>
                  <Modal
                    title="게시글 이동"
                    open={modalOpen}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                  >
                    <Row gutter={[16, 24]} style={{ padding: "16px 0" }}>
                      <Col span={24}>
                        <Flex align={"center"} justify={"center"} gap={20}>
                          <span>게시판선택</span>
                          <Select
                            style={{
                              width: "50%",
                            }}
                            value={changeMenu}
                            placeholder="게시판을 선택해주세요."
                            onChange={handleMenuChange}
                            options={comboMenu}
                          />
                        </Flex>
                      </Col>
                      <Col span={24}>
                        <Flex align={"center"} justify={"center"} gap={20}>
                          <span>말머리선택</span>
                          <Select
                            style={{
                              width: "50%",
                            }}
                            value={changeBracket}
                            placeholder="말머리 선택"
                            disabled={comboMenuAtBracket.length === 0}
                            onChange={(value) => {
                              setChangeBracket(value === "null" ? null : value);
                            }}
                            options={[
                              { value: "null", label: "말머리 선택 안함" },
                              ...comboMenuAtBracket,
                            ]}
                          />
                        </Flex>
                      </Col>
                    </Row>
                  </Modal>
                </>
              )}
              {(writer === "TRUE" || adminFlag === "Y") && (
                <>
                  <Button
                    type="primary"
                    onClick={(e) =>
                      navigate("/post/edit", {
                        state: { menuId, postId },
                      })
                    }
                  >
                    수정
                  </Button>
                  <Button type="primary" onClick={handleDeletePost}>
                    삭제
                  </Button>
                </>
              )}
            </Flex>
            <Flex align={"center"} gap={10}>
              {prevPostId && (
                <Button
                  type="primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "5px",
                  }}
                  onClick={handlePrevPost}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                    width="32"
                    height="28"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>이전글</span>
                </Button>
              )}
              {nextPostId && (
                <Button
                  type="primary"
                  onClick={handleNextPost}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "5px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                    width="32"
                    height="28"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>다음글</span>
                </Button>
              )}
              <Button
                type="primary"
                onClick={(e) => navigate(`/post/${menuId}`)}
              >
                목록
              </Button>
            </Flex>
          </Flex>
        </Col>

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
                <Tag color="#f50">
                  {notice === "MUST_READ" ? "필독" : "공지"}
                </Tag>
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
                      <strong>&nbsp;{commentData.length}</strong>
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
        </Col>

        <Col
          span={24}
          // style={{ borderBottom: "1px solid" }}
          // style={{ textAlign: "center" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <Col span={24} style={{ borderBottom: "1px solid", marginTop: "40px" }}>
          <div>
            <Flex align={"center"} gap={10}>
              <a
                style={{
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar size={50} src={profileImgUrl} />
                <span
                  style={{
                    marginLeft: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <strong>{createdUser}</strong>
                  님의 게시글 더보기
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                    width="28"
                    height="25"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </Flex>
          </div>
          <div style={{ margin: "14px 0" }}>
            <Flex align={"center"} gap={10}>
              <a
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
                  width="32"
                  height="28"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>댓글</span>
                <strong>&nbsp;{commentData.length}</strong>
              </a>
            </Flex>
          </div>
        </Col>

        <Col span={24}>
          <Flex justify={"space-between"} align={"center"}>
            <h3 id="comment">댓글</h3>
          </Flex>
          {commentData.length > 0 && (
            <List
              pagination={{
                position: "bottom",
                align: "center",
                pageSize: 10,
              }}
              dataSource={commentData}
              renderItem={(item, index) => (
                <>
                  {(!item.deletedAt ||
                    (item.deletedAt && item.childCount > 0)) && (
                    <List.Item
                    // style={{ border: "2px solid" }}
                    >
                      {item.deletedAt && item.childCount > 0 ? (
                        <p className={item.topCommentId && "comment-middle"}>
                          삭제된 댓글입니다
                        </p>
                      ) : (
                        ""
                      )}

                      {!item.deletedAt && updateComment !== item.commentId && (
                        <List.Item.Meta
                          avatar={
                            <a
                              className={item.topCommentId && "comment-middle"}
                            >
                              <Avatar size={50} src={item.profileImg} />
                            </a>
                          }
                          title={
                            <Flex justify={"space-between"} align={"center"}>
                              <span>
                                <a className="user-name">{item.createdUser}</a>
                                {item.writer === "TRUE" && (
                                  <Tag
                                    color="geekblue"
                                    style={{ marginLeft: "5px" }}
                                  >
                                    작성자
                                  </Tag>
                                )}
                              </span>
                              {(adminFlag === "Y" ||
                                item.writer === "TRUE") && (
                                <div>
                                  <Flex align={"center"}>
                                    <Dropdown
                                      menu={{
                                        items: commentItems,
                                        onClick: (e) =>
                                          handleCommentMenuClick(e, item),
                                      }}
                                      trigger={["click"]}
                                    >
                                      <a onClick={(e) => e.preventDefault()}>
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
                                  </Flex>
                                </div>
                              )}
                            </Flex>
                          }
                          description={
                            <>
                              <div style={{ display: "grid" }}>
                                <p
                                  style={{
                                    color: "black",
                                    margin: "0 0 5px 0",
                                  }}
                                >
                                  {item.topCommentId && (
                                    <a className="user-name">
                                      {item.topUserName}&nbsp;
                                    </a>
                                  )}
                                  <span style={{ whiteSpace: "pre-line" }}>
                                    {item.content}
                                  </span>
                                </p>

                                <div>
                                  <span>{item.createdAt}&nbsp;</span>
                                  <a
                                    onClick={(e) => {
                                      setUpdateComment(null);
                                      setOpenReplyComment(item.commentId);
                                    }}
                                  >
                                    답글쓰기
                                  </a>
                                </div>
                              </div>
                            </>
                          }
                        />
                      )}
                      {/* 댓글 수정 */}
                      {updateComment == item.commentId && (
                        <List.Item.Meta
                          description={
                            <>
                              <ReplyComment
                                commentId={item.commentId}
                                menuId={menuId}
                                postId={postId}
                                userName={createdUser}
                                value={item.content}
                                topCommentId={item.topCommentId}
                                handleCommentCancel={handleCommentCancel}
                                handleSearchComment={handleSearchComment}
                              />
                            </>
                          }
                        />
                      )}
                    </List.Item>
                  )}
                  {/* 답글 작성 */}
                  {item.commentId === openReplyComment && (
                    <ReplyComment
                      menuId={menuId}
                      postId={postId}
                      userName={createdUser}
                      topCommentId={item.commentId}
                      handleCommentCancel={handleCommentCancel}
                      handleSearchComment={handleSearchComment}
                    />
                  )}
                </>
              )}
            />
          )}
          {/* 댓글 작성 */}
          <ReplyComment
            menuId={menuId}
            postId={postId}
            userName={createdUser}
            handleSearchComment={handleSearchComment}
          />
        </Col>

        <Col span={24} style={{ padding: "16px 0px" }}>
          <Flex justify={"space-between"} align={"center"}>
            <Flex align={"center"} gap={10}>
              <Button
                type="primary"
                onClick={(e) =>
                  navigate("/post/edit", {
                    state: { menuId },
                  })
                }
              >
                글쓰기
              </Button>
            </Flex>
            <Flex align={"center"} gap={10}>
              <Button
                type="primary"
                onClick={(e) => navigate(`/post/${menuId}`)}
              >
                목록
              </Button>
              <Button
                href="#post-content"
                type="primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                }}
              >
                <span style={{ fontSize: "small" }}>▲</span>
                <span>&nbsp;TOP</span>
              </Button>
            </Flex>
          </Flex>
        </Col>
      </Row>

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
    </div>
  );
}

export default PostContent;
