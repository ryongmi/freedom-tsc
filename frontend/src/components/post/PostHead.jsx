import { Button, Col, Flex, Modal, Row, Select } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { patchMovePost, patchPost } from "../../services/apiPost";

function PostHead({
  menuId,
  postId,
  writer,
  prevPostId,
  prevMenuId,
  nextPostId,
  nextMenuId,
  changeMenu,
  changeBracket,
  comboMenu,
  comboBracket,
  comboMenuAtBracket,
  setChangeMenu,
  setChangeBracket,
  setComboMenuAtBracket,
  showModal,
  postType,
}) {
  const navigate = useNavigate();
  const { adminFlag } = useSelector((store) => store.user);
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 이전글
  async function handleNextPost() {
    try {
      navigate(`/${postType}/${nextMenuId}/${nextPostId}`);
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
    }
  }

  // 다음글
  async function handlePrevPost() {
    try {
      navigate(`/${postType}/${prevMenuId}/${prevPostId}`);
      //   showMessage(message);
    } catch (error) {
      //   showMessage(error.message, "error");
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

  // 게시글 이동 팝업 - 메뉴 변경 이벤트
  function handleMenuChange(value) {
    setChangeMenu(value);
    setChangeBracket(null);
    setComboMenuAtBracket(comboBracket.filter((item) => item.menuId === value));
  }

  // 게시글 이동 팝업 - 말머리 변경 이벤트
  function handleBracketChange(value) {
    setChangeBracket(value === "null" ? null : value);
  }

  function showMovePostModal() {
    setModalOpen(true);
  }

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
    <Col span={24} style={{ padding: "8px 0px", borderBottom: "1px solid" }}>
      <Flex justify={"space-between"} align={"center"}>
        <Flex align={"center"} gap={10}>
          {writer !== "TRUE" && adminFlag !== "Y" && <div></div>}
          {adminFlag === "N" && (
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
                        onChange={handleBracketChange}
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
            onClick={(e) =>
              navigate(
                `/${
                  postType === "postAll" ? postType : `${postType}/${menuId}`
                }`
              )
            }
          >
            목록
          </Button>
        </Flex>
      </Flex>
    </Col>
  );
}

export default PostHead;
