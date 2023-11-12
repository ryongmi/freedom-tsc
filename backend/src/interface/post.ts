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

export interface PostMove extends Post {
  changeMenu: number;
  changeBracket: number | null;
}
