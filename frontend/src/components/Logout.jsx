import AppButton from "../layout/AppButton";
import { logout } from "../services/apiUser";

function Logout() {
  async function handleClick(e) {
    try {
      await logout();
      window.location.replace("/");
    } catch (error) {
      console.log("error: " + error);
    }
  }

  return (
    <AppButton onClick={handleClick} ghost={true}>
      로그아웃
    </AppButton>
  );
}

export default Logout;
