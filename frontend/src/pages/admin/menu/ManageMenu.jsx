import { Button, Pagination, Space, Table, Tag } from "antd";
import { useState } from "react";
import "../../../styles/table.css";

const columns = [
  {
    title: () => {
      return <div className="table-head">name</div>;
    },
    dataIndex: "name",
    key: "name",
    // align: "right",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    align: "center",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

function ManageMenu() {
  const [dataSource, setDataSource] = useState(data);
  const [count, setCount] = useState(4);
  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
      tags: ["cool", "teacher"],
    };
    console.log(newData);
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  function handleChange(page, pageSize) {
    // 로우 수 보여주는 콤보박스 및 페이지 변경 이벤트
    console.log(page, pageSize);
  }
  function handleShowChange(current, size) {
    // 로우 수 보여주는 콤보박스 변경 이벤트
    console.log(current, size);
  }

  const defaultPageSize = count - 1;
  return (
    <div>
      <div>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          remove a row
        </Button>
      </div>
      <Table
        //   loading
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}

        // pagination={{
        //   //   defaultPageSize: 10,
        //   showSizeChanger: true,

        //   //   defaultCurrent: 1,
        //   //   pageSize: defaultPageSize,
        //   pageSizeOptions: ["10", "20", "30"],
        //   total: 30,
        //   onChange: handleChange,
        //   onShowSizeChange: handleShowChange,
        // }}
      />
      <Pagination
        defaultCurrent={1}
        total={500}
        onChange={handleChange}
        style={{ margin: "16px 0px", textAlign: "right" }}
      />
    </div>
  );
}

export default ManageMenu;
