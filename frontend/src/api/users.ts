import { axiosInstance } from './axiosInstance';
import { API_URL } from './constants';

interface ComboAuth {
  value: number;
  label: string;
}

interface ComboPerPage {
  value: string;
  label: string;
}

interface User {
  USER_ID: string;
  USER_LOGIN_ID: string;
  USER_NAME: string;
  AUTH_ID: number;
  TWITCH_TYPE: string;
  BROADCASTER_TYPE: string;
  CREATED_AT: string; // 더 정확한 처리를 위해 Date 객체를 사용하는 것을 고려해 보세요.
  LAST_LOGIN_AT: string; // 더 정확한 처리를 위해 Date 객체를 사용하는 것을 고려해 보세요.
  UPDATED_AT?: null | string; // 'null'이 가능한 값이므로 옵셔널로 표시합니다.
  // 필요하다면 Date 객체를 사용하세요.

  UPDATED_USER?: null | string;
  USER_STATUS: string;
}

export interface GetManageUserResponseData {
  comboAuth: Array<ComboAuth>;
  comboPerPage: Array<ComboPerPage>;
  totalCount: number;
  users: Array<User>;
}

export const getManageUser = async (): Promise<GetManageUserResponseData> => {
  const { data } = await axiosInstance.get(API_URL.USER.GET_MANAGE_USER());
  return data;
};
