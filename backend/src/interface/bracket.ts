export interface Bracket {
  // 머리글 정보
  bracketId: number | null;
  menuId: number;
  topMenuId: number;
  content: string;
  useFlag: string;
  sort: number;
}
