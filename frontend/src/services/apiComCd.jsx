import { DETAIL_COMCD, MANAGE_COMCD } from "../config/apiUrl";

export async function getManageComCd(
  currentPage,
  perPage,
  comcdOption,
  comcdOptionValue
) {
  const res = await fetch(
    `${MANAGE_COMCD}?page=${currentPage}&perPage=${perPage}&comcdOption=${comcdOption}&comcdOptionValue=${comcdOptionValue}`
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

export async function postManageComCd(item) {
  const res = await fetch(MANAGE_COMCD, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comCd: item }),
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

export async function patchManageComCd(item) {
  const res = await fetch(MANAGE_COMCD, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comCd: item }),
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("삭제실패");
  }

  const data = await res.json();

  return data;
}

export async function getDetailComCd(
  comId,
  currentPage,
  perPage,
  comcdOption,
  comcdOptionValue,
  useFlag
) {
  const res = await fetch(
    `${MANAGE_COMCD}/${comId}?page=${currentPage}&perPage=${perPage}&comcdOption=${comcdOption}&comcdOptionValue=${comcdOptionValue}&useFlag=${useFlag}`
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

export async function postDetailComCd(item, comId) {
  const res = await fetch(DETAIL_COMCD, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comCd: item, comId }),
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("저장실패");
  }

  const data = await res.json();

  return data;
}

export async function patchDetailComCd(item, comId) {
  const res = await fetch(DETAIL_COMCD, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comCd: item, comId }),
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("해당 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("삭제실패");
  }

  const data = await res.json();

  return data;
}
