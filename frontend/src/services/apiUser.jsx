import {
  USER_INFO,
  LOGOUT,
  MANAGE_USER,
  WARN_USER,
  MANAGE_WARN_USER,
  UN_WARN_USER,
  BAN_USER,
  MANAGE_BAN_USER,
  UN_BAN_USER,
} from "../config/apiUrl";

export async function getUserInfo() {
  const res = await fetch(USER_INFO, {
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("유저정보를 가져오지 못했습니다.");

  const data = await res.json();

  return data;
}

export async function logout() {
  const res = await fetch(LOGOUT, {
    method: "DELETE",
    credentials: "include", // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("로그아웃도중 오류가 발생하였습니다.");

  return null;
}

// 관리자 페이지 - 유저관련
export async function getManageUser(
  currentPage,
  perPage,
  userOption,
  userOptionValue,
  userAuthId,
  userStatus
) {
  const res = await fetch(
    `${MANAGE_USER}?page=${currentPage}&perPage=${perPage}&userOption=${userOption}&userOptionValue=${userOptionValue}&userAuthId=${userAuthId}&userStatus=${userStatus}`,
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

export async function patchManageUser(item) {
  const res = await fetch(MANAGE_USER, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: item }),
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
    throw Error("조회실패!");
  }

  const data = await res.json();

  return data;
}

export async function getManageWarnUser(
  currentPage,
  perPage,
  userOption,
  userOptionValue
) {
  const res = await fetch(
    `${MANAGE_WARN_USER}?page=${currentPage}&perPage=${perPage}&userOption=${userOption}&userOptionValue=${userOptionValue}`,
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

export async function getContentWarnUser(userId, currentPage, perPage) {
  const res = await fetch(
    `${MANAGE_WARN_USER}/${userId}?page=${currentPage}&perPage=${perPage}`,
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

export async function getManageBanUser(
  currentPage,
  perPage,
  userOption,
  userOptionValue
) {
  const res = await fetch(
    `${MANAGE_BAN_USER}?page=${currentPage}&perPage=${perPage}&userOption=${userOption}&userOptionValue=${userOptionValue}`,
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

export async function getContentBanUser(userId, currentPage, perPage) {
  const res = await fetch(
    `${MANAGE_BAN_USER}/${userId}?page=${currentPage}&perPage=${perPage}`,
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

export async function postWarnUser(item, postUrl, warnReason) {
  const res = await fetch(WARN_USER, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: item, postUrl, warnReason }),
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

export async function patchUnWarnUser(item, userId) {
  const res = await fetch(UN_WARN_USER, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ warn: item, userId }),
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

export async function postBanUser(item, postUrl, banReason) {
  const res = await fetch(BAN_USER, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: item, postUrl, banReason }),
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

export async function patchUnBanUser(item, userId) {
  const res = await fetch(UN_BAN_USER, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ban: item, userId }),
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
