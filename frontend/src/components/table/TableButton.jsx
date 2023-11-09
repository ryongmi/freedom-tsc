import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

function TableButton({
  handleItemAdd,
  handleItemRemove,
  handleSearch,
  handleSave,
  handleDelete,
  handleWarn,
  handleUnWarn,
  handleBan,
  handleUnBan,
  handlePostMove,
  handlePostNew,
}) {
  return (
    <div className="table-btn">
      <div>
        {handleItemAdd && (
          <Button
            style={{ cursor: "pointer" }}
            icon={<PlusOutlined className="table-btn-icon" />}
            onClick={handleItemAdd}
            shape="circle"
          />
        )}
        {handleItemRemove && (
          <Button
            icon={<MinusOutlined className="table-btn-icon" />}
            onClick={handleItemRemove}
            shape="circle"
            danger
          />
        )}
      </div>
      <div>
        {handlePostMove && <Button onClick={handlePostMove}>이동</Button>}
        {handleSearch && <Button onClick={handleSearch}>조회</Button>}
        {handleSave && <Button onClick={handleSave}>저장</Button>}
        {handleDelete && (
          <Button onClick={handleDelete} danger>
            삭제
          </Button>
        )}
        {handleWarn && (
          <Button onClick={handleWarn} type="primary" ghost>
            경고
          </Button>
        )}
        {handleUnWarn && <Button onClick={handleUnWarn}>경고 해제</Button>}
        {handleBan && (
          <Button onClick={handleBan} danger>
            벤
          </Button>
        )}
        {handleUnBan && <Button onClick={handleUnBan}>벤 해제</Button>}
        {handlePostNew && <Button onClick={handlePostNew}>글쓰기</Button>}
      </div>
    </div>
  );
}

export default TableButton;
