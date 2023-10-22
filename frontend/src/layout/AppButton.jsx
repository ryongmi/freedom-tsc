import { Button } from "antd";

function AppButton({ type = "primary", onClick, ghost, danger, children }) {
  if (ghost && danger)
    return (
      <Button
        type={type}
        // style={{ color: "white", border: "none", backgroundColor: "#4c4e50" }}
        onClick={onClick}
        ghost
        danger
      >
        {children}
      </Button>
    );

  if (danger)
    return (
      <Button
        type={type}
        // style={{ color: "white" }}
        onClick={onClick}
        danger
      >
        {children}
      </Button>
    );

  if (ghost)
    return (
      <Button
        type={type}
        // style={{ color: "white" }}
        onClick={onClick}
        ghost
      >
        {children}
      </Button>
    );

  return (
    <Button
      type={type}
      // style={{ color: "white", border: "none", backgroundColor: "#4c4e50" }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default AppButton;
