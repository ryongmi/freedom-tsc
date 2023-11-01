export interface Menu {
  // 대메뉴 정보
  menuId: number | null;
  menuName: string;
  adminFlag: string;
  useFlag: string;
  sort: number;
}

export interface DetailMenu extends Menu {
  // 중메뉴 정보
  postAuthId: number | null;
  commentAuthId: number | null;
  readAuthId: number | null;
  url: string;
  type: string | null;
}
