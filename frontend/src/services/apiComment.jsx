import { COMMENT, CREATED_COMMENT } from "../config/apiUrl";

export async function getComment(menuId, postId) {
  const res = await fetch(`${COMMENT}?menuId=${menuId}&postId=${postId}`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("조회실패!");
  }

  const data = await res.json();

  return data;
}

export async function postCreatedComment(item) {
  const res = await fetch(CREATED_COMMENT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment: item }),
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("저장실패");
  }

  const data = await res.json();

  return data;
}
