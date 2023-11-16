import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../services/apiUser";
import { updateUser } from "../../store/slice/userSlice";
import { Button } from "antd";

function Login({ handleLogin }) {
  const dispatch = useDispatch();
  const user = useLoaderData();

  useEffect(() => {
    const updateUserInfo = {
      userName: user?.displayName ?? "",
      loginId: user?.userLoginId ?? "",
      profileImgUrl: user?.profileImgUrl ?? "",
      broadcasterType: user?.broadcasterType ?? "",
      isLoggedIn: user?.isLoggedIn ?? false,
      adminFlag: user?.adminFlag ?? "N",
    };
    dispatch(updateUser(updateUserInfo));
  }, []);

  return (
    <Button onClick={handleLogin} ghost>
      로그인
    </Button>
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
