import { Button } from "antd";

function Logout({ handleLogout }) {
  return (
    <Button onClick={handleLogout} ghost>
      로그아웃
    </Button>
  );
}

export default Logout;
