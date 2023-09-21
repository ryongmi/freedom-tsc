import { API_URL } from '@/api/constants';
import { GetManageUserResponseData, getManageUser } from '@/api/users';
import { generateQueryKeysFromUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useGetUsers = () => {
  const result = useQuery(
    generateQueryKeysFromUrl(API_URL.USER.GET_MANAGE_USER()),
    getManageUser
  );

  return result;
};
