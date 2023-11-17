export {};

// tsc를 사용하면 req에 추가적인 데이터를 할당할시 에러가 발생하기 때문에
// 이렇게 따로 req에 사용할 변수를 알려줘야함
// tsc.json -> typeRoots에 경로 작성 필요
declare global {
  namespace Express {
    interface Request {
      menuAuth?: {
        post: string;
        comment: string;
      };
    }
  }
}
