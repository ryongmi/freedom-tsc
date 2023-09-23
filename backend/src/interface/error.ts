export default interface Error {
  code: string;
  errno: string;
  message: string;
  sql?: string;
}
