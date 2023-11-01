interface Default {
  // 공통코드 정보
  authId: number;
}

export interface Auth extends Default {
  authName: string;
  explanation: string;
  type: string;
  useFlag: string;
}

export interface AuthLevelCondition extends Default {
  post: number;
  comment: number;
  visit: number;
  period: number;
}
