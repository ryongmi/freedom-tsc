export interface ComCd {
  // 공통코드 정보
  comId: string;
  value?: string;
}

export interface DetailComCd extends ComCd {
  // 공통코드 상세 정보
  name: string;
  useFlag: string;
  sort: number;
}
