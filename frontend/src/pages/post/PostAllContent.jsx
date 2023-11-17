import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { getPostAllContent } from "../../services/apiPost";
import { useOutletContext, useParams } from "react-router-dom";
import "../../styles/post.css";
import "../../styles/comment.css";
import { iframeRegex } from "../../utils/iframeRegex";
import PostHead from "../../components/post/PostHead";
import PostTitle from "../../components/post/PostTitle";
import PostMain from "../../components/post/PostMain";
import PostFooter from "../../components/post/PostFooter";
import PostComment from "../../components/post/PostComment";

function PostAllContent() {
  const { showMessage, showModal } = useOutletContext();
  const { menuId, postId } = useParams();

  // combo
  const [comboNotice, setComboNotice] = useState([]);
  const [noticeValue, setNoticeValue] = useState([]);
  const [comboMenu, setComboMenu] = useState([]);
  const [comboBracket, setComboBracket] = useState([]);
  const [comboMenuAtBracket, setComboMenuAtBracket] = useState([]);
  const [changeMenu, setChangeMenu] = useState(null);
  const [changeBracket, setChangeBracket] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [menuAuth, setMenuAuth] = useState({});

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

  useEffect(() => {
    async function fetchData() {
      await handleSearch();
    }
    fetchData();
  }, [menuId, postId]);

  // 전체 조회 이벤트
  async function handleSearch() {
    try {
      const {
        post,
        comments,
        commentCount,
        comboBracket,
        comboMenu,
        comboNoticeOption,
        menuAuth,
      } = await getPostAllContent(menuId, postId);

      setPost(post);
      setCommentData(comments);
      setComboNotice(comboNoticeOption);
      setNoticeValue(post.notice ?? comboNoticeOption[0].value);
      setCommentCount(commentCount);
      setComboBracket(comboBracket);
      setComboMenu(comboMenu);
      setMenuAuth(menuAuth);

      if (post?.menuId ?? null)
        setComboMenuAtBracket(
          comboBracket.filter((item) => item.menuId === post.menuId)
        );

      setChangeMenu(post.menuId);
      setChangeBracket(post.bracketId);
    } catch (error) {
      console.log(error);
      // window.location.replace("/");
    }
  }

  return (
    <div id="post-content">
      <Row gutter={[16, 0]}>
        <PostHead
          menuId={menuId}
          postId={postId}
          writer={writer}
          prevPostId={prevPostId}
          prevMenuId={prevMenuId}
          nextPostId={nextPostId}
          nextMenuId={nextMenuId}
          changeMenu={changeMenu}
          changeBracket={changeBracket}
          comboMenu={comboMenu}
          comboBracket={comboBracket}
          comboMenuAtBracket={comboMenuAtBracket}
          setChangeMenu={setChangeMenu}
          setChangeBracket={setChangeBracket}
          setComboMenuAtBracket={setComboMenuAtBracket}
          showModal={showModal}
          postType={"postAll"}
        />

        <PostTitle
          menuId={menuId}
          postId={postId}
          menuName={menuName}
          notice={notice}
          bracket={bracket}
          title={title}
          createdUser={createdUser}
          createdAt={createdAt}
          authName={authName}
          profileImgUrl={profileImgUrl}
          noticeValue={noticeValue}
          commentLength={commentCount}
          handleSearch={handleSearch}
          setNoticeValue={setNoticeValue}
          comboNotice={comboNotice}
        />

        <PostMain
          content={content}
          createdUser={createdUser}
          profileImgUrl={profileImgUrl}
          commentLength={commentCount}
        />

        <PostComment
          menuId={menuId}
          postId={postId}
          createdUser={createdUser}
          commentData={commentData}
          setCommentData={setCommentData}
          setCommentCount={setCommentCount}
          menuAuth={menuAuth}
        />

        <PostFooter menuId={menuId} postType={"postAll"} menuAuth={menuAuth} />
      </Row>
    </div>
  );
}

export default PostAllContent;
