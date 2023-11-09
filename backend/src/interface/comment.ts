export interface Comment {
  // 공통코드 정보
  commentId: number | null;
  menuId: number;
  postId: number;
  topCommentId: number | null;
  content: string;
}
