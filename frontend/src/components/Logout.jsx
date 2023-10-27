import { Button } from "antd";
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
    <Button onClick={handleClick} ghost>
      로그아웃
    </Button>
  );
}

export default Logout;
