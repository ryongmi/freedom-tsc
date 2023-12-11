import {
  MENU_INFO,
  ADMIN_MENU_INFO,
  MANAGE_MENU,
  DETAIL_MENU,
} from "../config/apiUrl";

export async function getMenuInfo() {
  const res = await fetch(MENU_INFO, {
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("메뉴 정보를 가져오기 실패!");

  const data = await res.json();

  return data;
}

export async function getAdminMenuInfo() {
  const res = await fetch(ADMIN_MENU_INFO, {
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("메뉴 정보를 가져오기 실패!");

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
    `${MANAGE_MENU}?page=${currentPage}&perPage=${perPage}&menuName=${menuName}&adminFalg=${adminFalg}&useFlag=${useFlag}`,
    {
      credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
    }
  );

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("조회실패!");
  }

  const data = await res.json();

  return data;
}

export async function postManageMenu(item) {
  const res = await fetch(MANAGE_MENU, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu: item }),
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("저장실패!");
  }

  const data = await res.json();

  return data;
}

export async function patchManageMenu(item) {
  const res = await fetch(MANAGE_MENU, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu: item }),
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("삭제실패!");
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
    `${DETAIL_MENU}/${topMenuId}?page=${currentPage}&perPage=${perPage}&menuName=${menuName}&type=${type}&useFlag=${useFlag}`,
    {
      credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
    }
  );

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("조회실패!");
  }

  const data = await res.json();

  return data;
}

export async function postDetailMenu(item, topMenuId) {
  const res = await fetch(DETAIL_MENU, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu: item, topMenuId }),
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("저장실패!");
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
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("삭제실패!");
  }

  const data = await res.json();

  return data;
}
