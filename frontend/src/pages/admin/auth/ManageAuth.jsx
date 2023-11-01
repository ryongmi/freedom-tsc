import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Input, Select } from "antd";

import AppTable from "../../../components/table/AppTable";
import { setColumn } from "../../../components/table/SetColumn";

import {
  getManageAuth,
  patchManageAuth,
  postManageAuth,
} from "../../../services/apiAuth";

function ManageAuth() {
  const { showMessage, showModal } = useOutletContext();

  // 기본
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(null);
  const [newItemCount, setNewItemCount] = useState(0);

  // 콤보박스 아이템
  const [comboType, setComboType] = useState([]);
  const [comboUseFlag, setComboUseFlag] = useState([]);

  // 검색조건
  const [searchAuthName, setSearchAuthName] = useState("");
  const [searchUseFlag, setSearchUseFlag] = useState("ALL");

  const defaultColumns = [
    setColumn({ title: "등급명", key: "authName", editable: true, max: 15 }),
    setColumn({ title: "설명", key: "explanation", editable: true, max: 30 }),
    setColumn({ title: "생성일", key: "createdAt" }),
    setColumn({ title: "생성자", key: "createdUser" }),
    setColumn({ title: "수정일", key: "updatedAt" }),
    setColumn({ title: "수정자", key: "updatedUser" }),
    setColumn({
      title: "등업방식",
      key: "type",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <Select
          style={{
            width: 130,
          }}
          defaultValue={text}
          onChange={(value) => {
            record = { ...record, type: value };
            handleCellSave(record, "type");
          }}
          options={comboType}
        />
      ),
    }),
    setColumn({
      title: "사용여부",
      key: "useFlag",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <Select
          style={{
            width: 80,
          }}
          defaultValue={text}
          onChange={(value) => {
            record = { ...record, useFlag: value };
            handleCellSave(record, "useFlag");
          }}
          options={comboUseFlag}
        />
      ),
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
      const { auth, totalCount, comboType, comboUseFlag, comboPerPage } =
        await getManageAuth(
          currentPage,
          perPage,
          searchAuthName,
          searchUseFlag
        );

      setDataSource(auth);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);

      setComboType(comboType);
      setComboUseFlag(comboUseFlag);

      setNewItemCount(0);
      setSelectedRowKeys([]);
      showMessage("조회성공!");
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  async function handleSave() {
    if (selectedRowKeys.length === 0) {
      showMessage("저장할 데이터를 선택해주세요!", "warning");
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
            if (row.authName === "-") {
              isShowModal = true;
              throw Error(
                `${index + 1}번째줄의 등급명을 입력해주세요. ('-', 공백 불가)`
              );
            }

            fetchData.push(row);
          }
          break;
        }
      });

      const { message } = await postManageAuth(fetchData);
      await handleSearch();
      showMessage(message);
    } catch (error) {
      if (isShowModal) showModal("데이터 체크", error.message);
      else showMessage(error.message, "error");
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

          if (row.status !== "I") fetchData.push({ authId: row.authId });

          break;
        }
      });

      if (fetchData.length > 0) {
        const { message } = await patchManageAuth(fetchData);
        showMessage(message);
      }

      await handleSearch();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  function handleItemAdd() {
    const newData = {
      key: `new${newItemCount}`,
      authName: "-",
      explanation: "-",
      createdAt: null,
      createdUser: null,
      updatedAt: null,
      updatedUser: null,
      type: comboType[0].value,
      useFlag: comboUseFlag[0].value,
      status: "I",
      authId: null,
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
  async function handlePagingChange(page, pageSize) {
    // 로우 수 보여주는 콤보박스 및 페이지 변경 이벤트
    setCurrentPage(page);
    setPerPage(pageSize);
  }

  // // Table Cell Event
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

  return (
    <AppTable
      defaultColumns={defaultColumns}
      dataSource={dataSource}
      handleCellSave={handleCellSave}
      comboPerPage={comboPerPage}
      selectedRowKeys={selectedRowKeys}
      onSelectChange={onSelectChange}
      handleItemAdd={handleItemAdd}
      handleItemRemove={handleItemRemove}
      handleSearch={handleSearch}
      handleSave={handleSave}
      handleDelete={handleDelete}
      currentPage={currentPage}
      totalCount={totalCount}
      handlePagingChange={handlePagingChange}
    >
      <span>등급명</span>
      <Input onChange={(e) => setSearchAuthName(e.target.value)} />
      <span>사용유무</span>
      <Select
        style={{
          width: 80,
        }}
        value={searchUseFlag}
        onChange={(value) => {
          setSearchUseFlag(value);
        }}
        options={[{ value: "ALL", label: "ALL" }, ...comboUseFlag]}
      />
    </AppTable>
  );
}

export default ManageAuth;
