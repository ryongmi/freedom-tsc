import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Flex,
  List,
  Radio,
  Row,
  Space,
  Tag,
} from "antd";
import {
  getPostContent,
  patchChangeNotice,
  patchPost,
} from "../../services/apiPost";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
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
  const { adminFlag, userName } = useSelector((store) => store.user);
  const { menuId, postId } = useParams();
  const { showMessage, showModal } = useOutletContext();
  const navigate = useNavigate();

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // combo
  const [comboNotice, setComboNotice] = useState([]);
  const [noticeValue, setNoticeValue] = useState([]);

  const [prevPostId, setPrevPostId] = useState(null);
  const [nextPostId, setNextPostId] = useState(null);
  const [prevMenuId, setPrevMenuId] = useState(null);
  const [nextMenuId, setNextMenuId] = useState(null);

  const [menuName, setMenuName] = useState("");
  const [bracket, setBracket] = useState(null);
  const [notice, setNotice] = useState(null);
  const [title, setTitle] = useState("");
  const [authName, setAuthName] = useState("");
  const [content, setContent] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [createdUser, setCreatedUser] = useState("");
  const [writer, setWriter] = useState(false);

  // 댓글
  const [commentData, setCommentData] = useState([]);
  const [openReplyComment, setOpenReplyComment] = useState(null);
  const [updateComment, setUpdateComment] = useState(null);

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
  }, []);

  // 전체 조회 이벤트
  async function handleSearch() {
    try {
      const { post, comments, comboNoticeOption } = await getPostContent(
        menuId,
        postId
      );

      // 게시글 관련
      setTitle(post.title);
      // setContent(post.content);
      setContent(iframeRegex(post.content));
      setMenuName(post.menuName);
      setBracket(post.bracket);
      setAuthName(post.authName);
      setProfileImg(post.profileImgUrl);
      setCreatedAt(post.createdAt);
      setCreatedUser(post.createdUser);
      setNotice(post.notice);
      setWriter(post.writer);
      setPrevMenuId(post.prevMenuId);
      setNextMenuId(post.nextMenuId);
      setPrevPostId(post.prevPostId);
      setNextPostId(post.nextPostId);

      setCommentData(comments);
      setComboNotice(comboNoticeOption);
      setNoticeValue(post.notice ?? comboNoticeOption[0].value);
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

  // const oembedRegex = /<oembed[^>]*>/g;
  // const oembedMatch = content.match(oembedRegex);

  // // If an oembed element was found, convert it to an iframe element
  // if (oembedMatch) {
  //   const oembedUrl = oembedMatch[0].match(/url="([^"]*)"/)[1];
  //   const iframeElement = `<iframe src="${oembedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  //   // content = htmlString.replace(oembedRegex, iframeElement);

  //   setContent(content.replace(oembedRegex, iframeElement));
  // }

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
              <Button type="primary" onClick={handleDeletePost}>
                삭제
              </Button>
            </Flex>
            <Flex align={"center"} gap={10}>
              {prevPostId && (
                <Button type="primary" onClick={handleSave}>
                  이전글
                </Button>
              )}
              {nextPostId && (
                <Button type="primary" onClick={handleSave}>
                  다음글
                </Button>
              )}
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
              {notice && (
                <Tag color="#f50">
                  {notice === "MUST_READ" ? "필독" : "공지"}
                </Tag>
              )}
              [{bracket}] {title}
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
                      <strong>{commentData.length}</strong>
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
                <Avatar size={50} src={profileImg} />
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
                <strong>{commentData.length}</strong>
              </a>
            </Flex>
          </div>
        </Col>

        <Col span={24}>
          <Flex justify={"space-between"} align={"center"}>
            <h3>댓글</h3>
          </Flex>
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
                          <a className={item.topCommentId && "comment-middle"}>
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
                            {(adminFlag === "Y" || item.writer === "TRUE") && (
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
                                style={{ color: "black", margin: "0 0 5px 0" }}
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
          {/* 댓글 작성 */}
          <ReplyComment
            menuId={menuId}
            postId={postId}
            userName={createdUser}
            handleSearchComment={handleSearchComment}
          />
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
