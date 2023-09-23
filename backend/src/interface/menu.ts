export interface Menu {
  // 대메뉴 정보
  menuId?: string;
  menuName: string;
  useFlag: string;
  sort: number;
}

export interface DetailMenu extends Menu {
  // 중메뉴 정보
  topMenuId: number;
  postAuthId: number;
  commentAuthId: number;
  readAuthId: number;
  type: string;
}
