export interface Post {
  postId: number | null;
  menuId: number;
}

export interface PostContent extends Post {
  title: string;
  content: string;
  bracketId: number;
  notice: string | null;
}
