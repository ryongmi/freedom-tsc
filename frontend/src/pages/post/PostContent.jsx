import React, { useEffect, useState } from "react";
import { Avatar, Button, Col, Dropdown, Flex, List, Row } from "antd";
import { getPostContent } from "../../services/apiPost";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ReplyComment from "../../components/post/ReplyComment";
import "../../styles/post.css";
import "../../styles/comment.css";
import { getComment } from "../../services/apiComment";

function PostContent() {
  const { menuId, postId } = useParams();
  const { showMessage, showModal } = useOutletContext();
  const navigate = useNavigate();

  const [menuName, setMenuName] = useState("");
  const [bracket, setBracket] = useState(null);
  const [title, setTitle] = useState("");
  const [authName, setAuthName] = useState("");
  const [content, setContent] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [createdUser, setCreatedUser] = useState("");
  const [commentData, setCommentData] = useState([]);
  const [openReplyComment, setOpenReplyComment] = useState(null);
  const [updateComment, setUpdateComment] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { post, comments } = await getPostContent(menuId, postId);

        // 게시글 관련
        setTitle(post.title);
        setContent(post.content);
        setMenuName(post.menuName);
        setBracket(post.bracket);
        setAuthName(post.authName);
        setProfileImg(post.profileImgUrl);
        setCreatedAt(post.createdAt);
        setCreatedUser(post.createdUser);
        setCommentData(comments);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

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

  async function handleSave() {
    // if (title.length === 0) {
    //   showModal("데이터 미입력", "제목을 입력해주세요.");
    //   return;
    // }
    // if (content.length === 0) {
    //   showModal("데이터 미입력", "내용을 입력해주세요.");
    //   return;
    // }
    // try {
    //   const notice = noticeChecked ? noticeOption : null;
    //   const fetchData = {
    //     postId,
    //     menuId: menu,
    //     title,
    //     content,
    //     bracketId: bracket,
    //     notice,
    //   };
    //   debugger;
    //   const { message } = await postCreatePost(fetchData);
    //   showMessage(message);
    // } catch (error) {
    //   showMessage(error.message, "error");
    // }
  }

  async function handleCommentSave() {
    try {
      const fetchData = {
        postId,
        title,
        content,
      };
      debugger;
      // const { message } = await postCreatePost(fetchData);
      // showMessage(message);
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  function handleUpdateComment(e) {
    // e.preventDefault();
    // setUpdateComment(item.commentId);
  }

  function handleCommentCancel(e) {
    setOpenReplyComment(null);
    setUpdateComment(null);
  }

  function handleMenuClick(e, item) {
    switch (e.key) {
      case "0":
        setOpenReplyComment(null);
        setUpdateComment(item.commentId);
        break;
      case "1":
        break;

      default:
        break;
    }
  }

  const data = [
    {
      user: createdUser,
      date: createdAt,
      auth: authName,
      test: "test",
    },
  ];

  const items = [
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

  const position = "bottom";
  const align = "center";

  return (
    <div className="post-content">
      <Row gutter={[16, 0]}>
        <Col
          span={24}
          style={{ padding: "8px 0px", borderBottom: "1px solid" }}
        >
          <Flex justify={"space-between"} align={"center"}>
            <Flex align={"center"} gap={10}>
              <Button type="primary" onClick={handleSave}>
                이동
              </Button>
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
              <Button type="primary" onClick={handleSave}>
                삭제
              </Button>
            </Flex>
            <Flex align={"center"} gap={10}>
              <Button type="primary" onClick={handleSave}>
                이전글
              </Button>
              <Button type="primary" onClick={handleSave}>
                다음글
              </Button>
              <Button type="primary" onClick={(e) => navigate(-1)}>
                목록
              </Button>
            </Flex>
          </Flex>
        </Col>

        <Col span={24} style={{ borderBottom: "1px solid" }}>
          <div>
            <p>
              <a onClick={(e) => navigate(`/post/${menuId}`)}>{menuName}</a>
            </p>
            <h2 style={{ margin: "0" }}>
              [{bracket}] {title}
            </h2>
          </div>
          <List
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <a>
                      <Avatar size={50} src={profileImg} />
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
                    <a style={{ display: "flex", alignItems: "center" }}>
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
                      <strong>{commentData.length}</strong>
                    </a>
                    <Dropdown
                      menu={{
                        items,
                        onClick: (e) => handleMenuClick(e, item),
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
                  </Flex>
                </div>
              </List.Item>
            )}
          />
        </Col>

        <Col
          span={24}
          style={{ borderBottom: "1px solid" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <Col span={24}>
          <Flex justify={"space-between"} align={"center"}>
            <h3>댓글</h3>
          </Flex>
          <List
            pagination={{
              position,
              align,
              pageSize: 10,
            }}
            dataSource={commentData}
            renderItem={(item, index) => (
              <>
                <List.Item
                // style={{ border: "2px solid" }}
                >
                  {updateComment !== item.commentId && (
                    <List.Item.Meta
                      avatar={
                        <a className={item.topCommentId && "comment-middle"}>
                          <Avatar size={50} src={item.profileImg} />
                        </a>
                      }
                      title={
                        <Flex justify={"space-between"} align={"center"}>
                          <span>
                            <a className="user-name">{item.createdUser}</a>
                          </span>
                          <div>
                            <Flex align={"center"}>
                              <Dropdown
                                menu={{
                                  items,
                                  onClick: (e) => handleMenuClick(e, item),
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
                        </Flex>
                      }
                      description={
                        <>
                          <div style={{ display: "grid" }}>
                            <p style={{ color: "black", margin: "0 0 5px 0" }}>
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
          {/* 댓글 작성 */}
          <ReplyComment
            menuId={menuId}
            postId={postId}
            userName={createdUser}
            handleSearchComment={handleSearchComment}
          />
        </Col>
      </Row>
    </div>
  );
}

export default PostContent;
