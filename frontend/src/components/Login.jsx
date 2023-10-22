import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../services/apiUser";
import { updateUser } from "../store/slice/userSlice";
import AppButton from "../layout/AppButton";

function Login() {
  const dispatch = useDispatch();
  const user = useLoaderData();
  const state = "c3ab8aa609ea11e793ae92361f002671";
  const api = `http://id.twitch.tv/oauth2/authorize?response_type=code&client_id=tymp4f3nwou50k5wgrameksysbthdk&redirect_uri=http://localhost:8000/api/userState/login&scope=user:read:email&state=${state}`;

  useEffect(function () {
    const updateUserInfo = {
      userName: user?.DISPLAY_NAME ?? "",
      loginId: user?.USER_LOGIN_ID ?? "",
      profileImgUrl: user?.PROFILE_IMG_URL ?? "",
      broadcasterType: user?.BROADCASTER_TYPE ?? "",
      isLoggedIn: user?.DISPLAY_NAME ? true : false,
    };
    dispatch(updateUser(updateUserInfo));
  }, []);

  function handleClick(e) {
    window.location.href = api;
  }

  return (
    <AppButton onClick={handleClick} ghost={true}>
      로그인
    </AppButton>
    // <button onClick={handleClick}>로그인</button>
    // <Link onClick={handleClick}>로그인</Link>
    // <a href="https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=tymp4f3nwou50k5wgrameksysbthdk&redirect_uri=http://localhost:3000&scope=user:read:email&state=c3ab8aa609ea11e793ae92361f002671">
    //   로그인
    // </a>
  );
}

export async function loader() {
  try {
    const user = await getUserInfo();
    return user;
  } catch (error) {
    console.log("error: " + error);
  }
}

export default Login;
