import {
  Button,
  Pagination,
  Table,
  Input,
  Form,
  InputNumber,
  Select,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../styles/table.css";
import {
  getManageMenu,
  patchManageMenu,
  postManageMenu,
} from "../../../services/apiMenu";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import AppBreadcrumb from "../../../layout/AppBreadcrumb";
import { useOutletContext } from "react-router-dom";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleCellSave,
  type,
  min,
  max,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleCellSave(
        {
          ...record,
          ...values,
        },
        dataIndex
      );
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title}은 공백일수 없습니다.`,
          },
        ]}
      >
        {type === "number" ? (
          <InputNumber
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            min={min}
            max={max}
          />
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            showCount
            maxLength={max}
          />
        )}
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

function setColumn({
  title,
  key,
  align = "center",
  editable = false,
  max,
  min,
  type,
  render,
  children,
}) {
  return {
    title,
    dataIndex: key,
    key,
    align,
    editable,
    max,
    min,
    type,
    render,
    children,
  };
}

function ManageMenu() {
  const { showMessage, showModal, colorBgContainer } = useOutletContext();
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [comboUseFlag, setComboUseFlag] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [newItemCount, setNewItemCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(null);

  const defaultColumns = [
    setColumn({ title: "메뉴명", key: "menuName", editable: true, max: 30 }),
    setColumn({ title: "생성일", key: "createdAt" }),
    setColumn({ title: "생성자", key: "createdUser" }),
    setColumn({ title: "수정일", key: "updatedAt" }),
    setColumn({ title: "수정자", key: "updatedUser" }),
    setColumn({
      title: "사용여부",
      key: "useFlag",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <Select
          defaultValue={text}
          style={{
            width: 120,
          }}
          onChange={(value) => {
            record = { ...record, useFlag: value };
            handleCellSave(record, "useFlag");
          }}
          options={comboUseFlag}
        />
      ),
    }),
    setColumn({
      title: "순서",
      key: "sort",
      editable: true,
      min: 1,
      max: 999,
      type: "number",
    }),
  ];

  useEffect(() => {
    async function fetchData() {
      await handleSearch();
    }
    fetchData();
  }, [currentPage, perPage]);

  // Table Button Event
  async function handleSearch() {
    try {
      const { menu, totalCount, comboPerPage, comboUseFlag } =
        await getManageMenu(currentPage, perPage);

      setDataSource(menu);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);
      setComboUseFlag(comboUseFlag);
      setSelectedRowKeys([]);
      showMessage("조회성공!");
    } catch (error) {
      showMessage("조회실패!", "error");
      console.log("error: " + error);
    }
  }

  async function handleSave() {
    if (selectedRowKeys.length === 0) {
      showMessage("warning", "저장할 데이터를 선택해주세요!");
      return;
    }

    let isShowModal = false;
    try {
      const fetchData = [];
      selectedRowKeys.forEach((key) => {
        for (let index = 0; index < dataSource.length; index++) {
          const row = dataSource[index];
          if (row.key !== key) continue;

          if (row.status !== "S") {
            if (row.menuName === "-") {
              isShowModal = true;
              throw Error(
                `${index + 1}번째줄의 메뉴이름을 입력해주세요. ('-', 공백 불가)`
              );
            }
            debugger;
            fetchData.push(row);
          }
          break;
        }
      });

      if (fetchData.length === 0) return;
      const { message } = await postManageMenu(fetchData);
      await handleSearch();
      showMessage(message);
    } catch (error) {
      if (isShowModal) showModal("데이터 체크", error.message);
      else showMessage("저장실패!", "error");
      console.log("error: " + error);
    }
  }

  async function handleDelete() {
    if (selectedRowKeys.length === 0) {
      showMessage("삭제할 데이터를 선택해주세요!", "warning");
      return;
    }

    try {
      const fetchData = [];
      selectedRowKeys.forEach((key) => {
        for (let index = 0; index < dataSource.length; index++) {
          const row = dataSource[index];
          if (row.key !== key) continue;

          if (row.status !== "I") fetchData.push(row.menuId);

          break;
        }
      });

      if (fetchData.length > 0) {
        const { message } = await patchManageMenu(fetchData);
        showMessage(message);
      }

      await handleSearch();
    } catch (error) {
      showMessage("삭제실패!", "error");
      console.log("error: " + error);
    }
  }

  function handleItemAdd() {
    const newData = {
      key: `new${newItemCount}`,
      menuName: "-",
      createdAt: null,
      createdUser: null,
      updatedAt: null,
      updatedUser: null,
      useFlag: comboUseFlag[0].value,
      sort: 1,
      status: "I",
      menuId: null,
    };

    setDataSource([...dataSource, newData]);
    setSelectedRowKeys([...selectedRowKeys, newData.key]);
    setNewItemCount(newItemCount + 1);
  }

  function handleItemRemove() {
    const newData = [...dataSource];
    const newSelRowKeys = [...selectedRowKeys];

    for (let index = 0; index < newSelRowKeys.length; index++) {
      const selRowKey = newSelRowKeys[index];

      const removeInex = newData.findIndex((item) => selRowKey === item.key);
      if (newData[removeInex].status !== "I") continue;

      newData.splice(removeInex, 1);
      newSelRowKeys.splice(index, 1);
      index--;
    }

    setDataSource(newData);
    setSelectedRowKeys(newSelRowKeys);
    setNewItemCount(0);
  }

  // Table CheckBox Click Event
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Table Paging Event
  async function handleChange(page, pageSize) {
    // 로우 수 보여주는 콤보박스 및 페이지 변경 이벤트
    setCurrentPage(page);
    setPerPage(pageSize);
  }

  // Table Cell Event
  function handleCellSave(row, dataIndex) {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    if (item[dataIndex] !== row[dataIndex]) {
      newData.splice(index, 1, {
        ...item,
        ...row,
        status: row.status === "I" ? "I" : "U",
      });
      setDataSource(newData);

      const selItem = selectedRowKeys.find((item) => row.key === item);
      if (!selItem) setSelectedRowKeys([...selectedRowKeys, row.key]);
    }
  }

  // Table row, col seting
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleCellSave,
        type: col.type,
        min: col.min,
        max: col.max,
      }),
    };
  });
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <>
      <AppBreadcrumb />
      <Content
        className="scroll"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: colorBgContainer,
          overflow: "auto",
        }}
      >
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <Button
            icon={<PlusOutlined style={{ fontSize: "14px" }} />}
            onClick={handleItemAdd}
            shape="circle"
          ></Button>
          <Button
            icon={<MinusOutlined style={{ fontSize: "14px" }} />}
            onClick={handleItemRemove}
            shape="circle"
          ></Button>

          <Button onClick={handleSearch}>조회</Button>
          <Button onClick={handleSave}>저장</Button>
          <Button onClick={handleDelete} danger>
            삭제
          </Button>
        </div>
        <Table
          components={components}
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        />
        <Pagination
          showSizeChanger
          current={currentPage}
          total={totalCount}
          onChange={handleChange}
          pageSizeOptions={comboPerPage}
          style={{ margin: "16px 0px", textAlign: "right" }}
        />
      </Content>
    </>
  );
}

export default ManageMenu;
