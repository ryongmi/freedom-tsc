import { Button, Col, Flex } from "antd";
import { useNavigate } from "react-router-dom";

function PostFooter({ menuId }) {
  const navigate = useNavigate();

  return (
    <Col span={24} style={{ padding: "16px 0px" }}>
      <Flex justify={"space-between"} align={"center"}>
        <Flex align={"center"} gap={10}>
          <Button
            type="primary"
            onClick={(e) =>
              navigate("/post/edit", {
                state: { menuId },
              })
            }
          >
            글쓰기
          </Button>
        </Flex>
        <Flex align={"center"} gap={10}>
          <Button type="primary" onClick={(e) => navigate(`/post/${menuId}`)}>
            목록
          </Button>
          <Button
            href="#post-content"
            type="primary"
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <span style={{ fontSize: "small" }}>▲</span>
            <span>&nbsp;TOP</span>
          </Button>
        </Flex>
      </Flex>
    </Col>
  );
}

export default PostFooter;
