import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

function TableButton({
  handleItemAdd,
  handleItemRemove,
  handleSearch,
  handleSave,
  handleDelete,
}) {
  return (
    <div className="table-btn table-content">
      <div>
        <Button
          style={{ cursor: "pointer" }}
          icon={<PlusOutlined className="table-btn-icon" />}
          onClick={handleItemAdd}
          shape="circle"
        />
        <Button
          icon={<MinusOutlined className="table-btn-icon" />}
          onClick={handleItemRemove}
          shape="circle"
          danger
        />
      </div>
      <div>
        <Button onClick={handleSearch}>조회</Button>
        <Button onClick={handleSave}>저장</Button>
        <Button onClick={handleDelete} danger>
          삭제
        </Button>
      </div>
    </div>
  );
}

export default TableButton;
