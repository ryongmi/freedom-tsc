// 홈페이지 URL
const BASE_URL = "http://localhost:8000/api";

// 트위치 관련
const twitchState = "c3ab8aa609ea11e793ae92361f002671";
export const TWITCH_LOGIN_API = `http://id.twitch.tv/oauth2/authorize?response_type=code&client_id=tymp4f3nwou50k5wgrameksysbthdk&redirect_uri=http://localhost:8000/api/userState/login&scope=user:read:email&state=${twitchState}`;

// 유저 및 로그인 관련
export const USER_INFO = `${BASE_URL}/userState/userInfo`;
export const LOGOUT = `${BASE_URL}/userState/logout`;

// 메뉴 관련
export const MENU_INFO = `${BASE_URL}/useInfo/getMenu`;
export const MAMAGE_MENU = `${BASE_URL}/admin/menu/manageMenu`;
export const DETAIL_MENU = `${BASE_URL}/admin/menu/detailMenu`;

// 말머리 관련
export const BRACKET = `${BASE_URL}/admin/menu/manageBracket`;
