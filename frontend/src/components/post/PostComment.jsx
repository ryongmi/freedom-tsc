import { Avatar, Col, Dropdown, Flex, List, Tag } from "antd";
import ReplyComment from "./ReplyComment";
import { useSelector } from "react-redux";
import { getComment, patchComment } from "../../services/apiComment";
import { useState } from "react";

const commentItems = [
  {
    key: "0",
    danger: true,
    label: "삭제",
  },
];

const commentWriterItems = [
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

function PostComment({
  menuId,
  postId,
  createdUser,
  commentData,
  setCommentData,
  setCommentCount,
}) {
  const { adminFlag, userName } = useSelector((store) => store.user);
  const [openReplyComment, setOpenReplyComment] = useState(null);
  const [updateComment, setUpdateComment] = useState(null);

  // 댓글 조회 - 댓글 변경시 실행됨
  async function handleSearchComment(e) {
    try {
      const { comments, commentCount } = await getComment(menuId, postId);
      setCommentData(comments);
      setCommentCount(commentCount);
      setOpenReplyComment(null);
      setUpdateComment(null);
    } catch (error) {
      console.log(error);
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

  return (
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
              {(!item.deletedAt || (item.deletedAt && item.childCount > 0)) && (
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
                          {(adminFlag === "Y" ||
                            item.createdUser === userName) && (
                            <div>
                              <Flex align={"center"}>
                                <Dropdown
                                  menu={{
                                    items:
                                      item.createdUser === userName
                                        ? commentWriterItems
                                        : commentItems,
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
  );
}

export default PostComment;
