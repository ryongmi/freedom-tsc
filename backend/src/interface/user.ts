interface defaultUser {
  // 로그인 후 프론트에서 받아오는 정보
  userId: number;
  authId: number;
}

export interface User extends defaultUser {
  // 로그인시 트위치에서 받아오는 정보
  id: string;
  login: string;
  email: string;
  type: string;
  broadcaster_type: string;
  display_name?: string;
  profile_image_url?: string;
}

export interface WarnUser extends defaultUser {
  warnId: number;
}

export interface BanUser extends defaultUser {
  banId: number;
}
