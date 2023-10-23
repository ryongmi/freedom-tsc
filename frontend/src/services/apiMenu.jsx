const API_URL = "http://localhost:8000/api";

export async function getMenuInfo(adminFlag) {
  const res = await fetch(`${API_URL}/useInfo/getMenu/${adminFlag}`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting menu");

  const data = await res.json();

  return data;
}

export async function getMenus(adminFlag) {
  const res = await fetch(`${API_URL}/useInfo/getMenu/${adminFlag}`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting menu");

  const data = await res.json();

  return data;
}
