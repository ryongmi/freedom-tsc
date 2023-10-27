import { USER_INFO, LOGOUT } from "../config/apiUrl";

export async function getUserInfo() {
  const res = await fetch(USER_INFO);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting menu");

  const data = await res.json();

  return data;
}

export async function logout() {
  const res = await fetch(LOGOUT, {
    method: "DELETE",
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting menu");

  return null;
}
