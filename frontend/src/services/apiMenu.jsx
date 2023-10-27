import { MENU_INFO, MAMAGE_MENU, DETAIL_MENU } from "../config/apiUrl";

export async function getMenuInfo(adminFlag) {
  const res = await fetch(`${MENU_INFO}/${adminFlag}`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting menu");

  const data = await res.json();

  return data;
}

export async function getManageMenu(
  currentPage,
  perPage,
  menuName,
  adminFalg,
  useFlag
) {
  const res = await fetch(
    `${MAMAGE_MENU}?page=${currentPage}&perPage=${perPage}&menuName=${menuName}&adminFalg=${adminFalg}&useFlag=${useFlag}`
  );

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("조회실패!");

  const data = await res.json();

  return data;
}

export async function postManageMenu(item) {
  const res = await fetch(MAMAGE_MENU, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu: item }),
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

export async function patchManageMenu(item) {
  const res = await fetch(MAMAGE_MENU, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu: item }),
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("삭제실패");
  }

  const data = await res.json();

  return data;
}

export async function getDetailMenu(
  topMenuId,
  currentPage,
  perPage,
  menuName,
  type,
  useFlag
) {
  const res = await fetch(
    `${DETAIL_MENU}/${topMenuId}?page=${currentPage}&perPage=${perPage}&menuName=${menuName}&type=${type}&useFlag=${useFlag}`
  );

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("조회실패!");

  const data = await res.json();

  return data;
}

export async function postDetailMenu(item) {
  const res = await fetch(DETAIL_MENU, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu: item }),
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

export async function patchDetailMenu(item) {
  const res = await fetch(DETAIL_MENU, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu: item }),
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("삭제실패");
  }

  const data = await res.json();

  return data;
}
