import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { ImageResizeEditing } from "@ckeditor/ckeditor5-image";
import { Button, Checkbox, Col, Flex, Input, Row, Select } from "antd";
import { getPostEdit, postCreatePost } from "../../services/apiPost";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "../../styles/post.css";
import { useSelector } from "react-redux";

function PostEditor() {
  const adminFlag = useSelector((store) => store.user.adminFlag);
  const { showMessage, showModal } = useOutletContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const menuId = state?.menuId ?? null;
  const postId = state?.postId ?? null;

  const [noticeChecked, setNoticeChecked] = useState(false);
  const [noticeOption, setNoticeOption] = useState("");
  const [menu, setMenu] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 콤보박스 아이템
  const [comboNoticeOption, setComboNoticeOption] = useState([]);
  const [comboMenu, setComboMenu] = useState([]);
  const [comboBracket, setComboBracket] = useState([]);
  const [comboMenuAtBracket, setComboMenuAtBracket] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { post, comboBracket, comboMenu, comboNoticeOption } =
          await getPostEdit(menuId, postId);

        // 콤보박스 아이템
        setComboNoticeOption(comboNoticeOption);
        setComboBracket(comboBracket);
        setComboMenu(comboMenu);

        if (post?.menuId ?? null)
          setComboMenuAtBracket(
            comboBracket.filter((item) => item.menuId === post.menuId)
          );

        if (menuId) {
          setMenu(post?.menuId ?? Number(menuId));
        } else {
          setMenu(post?.menuId ?? null);
        }

        setTitle(post?.title ?? "");
        setContent(post?.content ?? "");
        setBracket(post?.bracketId ?? null);
        setNoticeChecked(post?.notice ?? false);
        setNoticeOption(post?.notice ?? comboNoticeOption[0].value);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  function handleMenuChange(value) {
    setMenu(value);
    setBracket(null);
    setComboMenuAtBracket(comboBracket.filter((item) => item.menuId === value));
  }

  async function handleSave() {
    if (!menu) {
      showModal("데이터 미입력", "게시판을 선택해주세요.");
      return;
    }

    if (title.length === 0) {
      showModal("데이터 미입력", "제목을 입력해주세요.");
      return;
    }

    if (content.length === 0) {
      showModal("데이터 미입력", "내용을 입력해주세요.");
      return;
    }

    try {
      const notice = noticeChecked ? noticeOption : null;

      const fetchData = {
        postId,
        menuId: menu,
        title,
        content,
        bracketId: bracket,
        notice,
      };

      const { message } = await postCreatePost(fetchData);
      showMessage(message);
      navigate(`/post/${menu}`);
      // navigate(-1);
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3050"
      : "https://korgeobug.com";
  const imgLink = `${url}/images`;

  function customUploadAdapter(loader) {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          const data = new FormData();
          loader.file.then((file) => {
            data.append("name", file.name);
            data.append("file", file);

            fetch(`${url}/api/upload`, {
              method: "POST",
              body: data,
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: `${imgLink}/${res.filename}`,
                });
              })
              .catch((err) => reject(err));
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <div id="post-content">
      <Row gutter={[16, 16]}>
        <Col span={24} style={{ borderBottom: "1px solid" }}>
          <Flex justify={"space-between"} align={"center"}>
            <h2>카페 글쓰기</h2>
            <div>
              {adminFlag === "Y" && (
                <>
                  <Checkbox
                    checked={noticeChecked}
                    onChange={(e) => setNoticeChecked(e.target.checked)}
                  >
                    공지 등록
                  </Checkbox>
                  {noticeChecked && (
                    <Select
                      style={{ width: "120px" }}
                      value={noticeOption}
                      onChange={(value) => {
                        setNoticeOption(value);
                      }}
                      options={comboNoticeOption}
                    />
                  )}
                </>
              )}

              <Button type="primary" onClick={handleSave}>
                등록
              </Button>
            </div>
          </Flex>
        </Col>

        <Col span={18}>
          <Select
            style={{
              width: "100%",
            }}
            value={menu}
            placeholder="게시판을 선택해주세요."
            onChange={handleMenuChange}
            options={comboMenu}
          />
        </Col>
        <Col span={6}>
          <Select
            style={{
              width: "100%",
            }}
            value={bracket}
            placeholder="말머리 선택"
            disabled={comboMenuAtBracket.length === 0}
            onChange={(value) => {
              setBracket(value === "null" ? null : value);
            }}
            options={[
              { value: "null", label: "말머리 선택 안함" },
              ...comboMenuAtBracket,
            ]}
          />
        </Col>
        <Col span={24}>
          <Input
            showCount
            type="text"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
          />
        </Col>

        <Col span={24}>
          <CKEditor
            editor={ClassicEditor}
            data={content}
            config={{
              extraPlugins: [uploadPlugin],
            }}
            // onReady={(editor) => {
            //   // You can store the "editor" and use when it is needed.
            //   console.log("Editor is ready to use!", editor);
            // }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
              // console.log({ event, editor, data });
            }}
            // onBlur={(event, editor) => {
            //   console.log("Blur.", editor);
            // }}
            // onFocus={(event, editor) => {
            //   console.log("Focus.", editor);
            // }}
            // onError={(event, editor) => {
            //   console.log("Error.", editor);
            // }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default PostEditor;
