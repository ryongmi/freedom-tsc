import {
  POST,
  POST_ALL,
  POST_EDIT,
  POST_CHANGE_NOTICE,
  POST_MOVE,
} from "../config/apiUrl";

export async function getPostAll(
  currentPage,
  perPage,
  dateValue,
  dateOption,
  postValue,
  postOption
) {
  const res = await fetch(
    `${POST_ALL}?page=${currentPage}&perPage=${perPage}&dateValue=${dateValue}&dateOption=${dateOption}&postValue=${postValue}&postOption=${postOption}`
  );

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("조회실패!");
  }

  const data = await res.json();

  return data;
}

export async function getPostAllContent(menuId, postId) {
  const res = await fetch(`${POST_ALL}/${menuId}/${postId}`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("게시글을 읽을 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("조회실패!");
  }

  const data = await res.json();

  return data;
}

export async function getPost(
  menuId,
  currentPage,
  perPage,
  bracketValue,
  dateValue,
  dateOption,
  postValue,
  postOption
) {
  const res = await fetch(
    `${POST}/${menuId}?page=${currentPage}&perPage=${perPage}&bracketId=${bracketValue}&dateValue=${dateValue}&dateOption=${dateOption}&postValue=${postValue}&postOption=${postOption}`
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

export async function getPostContent(menuId, postId) {
  const res = await fetch(`${POST}/${menuId}/${postId}`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) {
    if (res.status === 400) throw Error("데이터 입력 형식 에러");
    if (res.status === 401) {
      alert("게시글을 읽을 권한이 없습니다");
      window.location.replace("/");
    }
    if (res.status === 500) throw Error("서버에서 에러가 발생하였습니다");
    throw Error("조회실패!");
  }

  const data = await res.json();

  return data;
}

export async function getPostEdit(menuId, postId) {
  const res = await fetch(`${POST_EDIT}?menuId=${menuId}&postId=${postId}`);

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

export async function postCreatePost(item) {
  const res = await fetch(POST_EDIT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post: item }),
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

export async function patchPost(item) {
  const res = await fetch(POST, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post: item }),
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

export async function patchChangeNotice(item) {
  const res = await fetch(POST_CHANGE_NOTICE, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
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

export async function patchMovePost(item) {
  const res = await fetch(POST_MOVE, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post: item }),
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
