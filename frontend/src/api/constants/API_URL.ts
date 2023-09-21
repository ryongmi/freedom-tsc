export const API_URL = {
  USER: {
    /* ******** GET ******** */
    GET_MANAGE_USER: (
      userOption: string = '',
      userOptionValue: string = '',
      page: number | string = '',
      perPage: number | string = ''
    ) =>
      `admin/user/manageUser?userOption=${userOption}&userOptionValue=${userOptionValue}&page=${page}&perPage=${perPage}`,
    GET_MANAGE_WARN_USER: (
      userOption: string = '',
      userOptionValue: string = '',
      page: number | string = '',
      perPage: number | string = ''
    ) =>
      `admin/user/manageWarnUser?userOption=${userOption}&userOptionValue=${userOptionValue}&page=${page}&perPage=${perPage}`,
    GET_MANAGE_WARN_CONTENT: (
      userId: string,
      page: number | string = '',
      perPage: number | string = ''
    ) => `admin/user/manageWarnUser/${userId}?page=${page}&perPage=${perPage}`,
    GET_MANAGE_BAN_USER: (
      userOption: string = '',
      userOptionValue: string = '',
      page: number | string = '',
      perPage: number | string = ''
    ) =>
      `admin/user/manageBanUser?userOption=${userOption}&userOptionValue=${userOptionValue}&page=${page}&perPage=${perPage}`,
    GET_MANAGE_BAN_CONTENT: (
      userId: string,
      page: number | string = '',
      perPage: number | string = ''
    ) => `admin/user/manageBanUser/${userId}?page=${page}&perPage=${perPage}`,
    /* ******** POST ******** */
  },
} as const;
