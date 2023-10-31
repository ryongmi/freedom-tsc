export interface ComCd {
  // 공통코드 정보
  comId: string;
  name: string;
  value: string;
}

export interface DetailComCd extends ComCd {
  // 공통코드 상세 정보
  useFlag: string;
  sort: number;
}
