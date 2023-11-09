import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Input } from "antd";

import AppTable from "../../../components/table/AppTable";
import { setColumn } from "../../../components/table/SetColumn";

import {
  getManageAuthLevelCondition,
  postManageAuthLevelCondition,
} from "../../../services/apiAuth";

function ManageAuthLevelCondition() {
  const { showMessage, showModal } = useOutletContext();

  // 기본
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(null);
  const [newItemCount, setNewItemCount] = useState(0);

  // 검색조건
  const [searchAuthName, setSearchAuthName] = useState("");

  const defaultColumns = [
    setColumn({ title: "등급명", key: "authName" }),
    setColumn({
      title: "게시글수",
      key: "post",
      editable: true,
      min: 0,
      max: 99999,
      type: "number",
    }),
    setColumn({
      title: "댓글수",
      key: "comment",
      editable: true,
      min: 0,
      max: 99999,
      type: "number",
    }),
    setColumn({
      title: "방문횟수",
      key: "visit",
      editable: true,
      min: 0,
      max: 99999,
      type: "number",
    }),
    setColumn({
      title: "가입기간(주)",
      key: "period",
      editable: true,
      min: 0,
      max: 99999,
      type: "number",
    }),
    setColumn({ title: "수정일", key: "updatedAt" }),
    setColumn({ title: "수정자", key: "updatedUser" }),
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
      const { auth, totalCount, comboPerPage } =
        await getManageAuthLevelCondition(currentPage, perPage, searchAuthName);

      setDataSource(auth);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);

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

          if (row.status !== "S") fetchData.push(row);

          break;
        }
      });

      const { message } = await postManageAuthLevelCondition(fetchData);
      await handleSearch();
      showMessage(message);
    } catch (error) {
      if (isShowModal) showModal("데이터 체크", error.message);
      else showMessage(error.message, "error");
    }
  }

  function handleItemAdd() {
    const newData = {
      key: `new${newItemCount}`,
      authName: "-",
      post: 0,
      comment: 0,
      visit: 0,
      period: 0,
      updatedAt: null,
      updatedUser: null,
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
      currentPage={currentPage}
      totalCount={totalCount}
      handlePagingChange={handlePagingChange}
    >
      <span>등급명</span>
      <Input
        placeholder="검색어를 입력해주세요"
        onChange={(e) => setSearchAuthName(e.target.value)}
      />
    </AppTable>
  );
}

export default ManageAuthLevelCondition;
