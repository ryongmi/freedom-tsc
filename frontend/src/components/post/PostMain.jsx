import { Avatar, Col, Flex } from "antd";

function PostMain({ content, createdUser, profileImgUrl, commentLength }) {
  return (
    <>
      <Col
        span={24}
        // style={{ borderBottom: "1px solid" }}
        // style={{ textAlign: "center" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Col span={24} style={{ borderBottom: "1px solid", marginTop: "40px" }}>
        <div>
          <Flex align={"center"} gap={10}>
            <a
              style={{
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar size={50} src={profileImgUrl} />
              <span
                style={{
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong>{createdUser}</strong>
                님의 게시글 더보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                  width="28"
                  height="25"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </a>
          </Flex>
        </div>
        <div style={{ margin: "14px 0" }}>
          <Flex align={"center"} gap={10}>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                color: "black",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="32"
                height="28"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>댓글</span>
              <strong>&nbsp;{commentLength}</strong>
            </a>
          </Flex>
        </div>
      </Col>
    </>
  );
}

export default PostMain;
