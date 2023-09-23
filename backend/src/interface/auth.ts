export interface Auth {
  // 공통코드 정보
  authId: string;
  authName: string;
  explanation: string;
  type: string;
}

export interface AuthLevelCondition extends Auth {
  // 공통코드 상세 정보
  post?: number;
  comment?: number;
  visit?: number;
  period?: number;
}
