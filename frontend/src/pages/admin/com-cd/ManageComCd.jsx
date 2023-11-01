import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, Input, Select } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import AppTable from "../../../components/table/AppTable";
import { setColumn } from "../../../components/table/SetColumn";

import {
  getManageComCd,
  patchManageComCd,
  postManageComCd,
} from "../../../services/apiComCd";

function ManageComCd() {
  const { showMessage, showModal } = useOutletContext();
  const navigate = useNavigate();

  // 기본
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(null);
  const [newItemCount, setNewItemCount] = useState(0);

  // 콤보박스 아이템
  const [comboComCdOption, setComboComCdOption] = useState([]);

  // 검색조건
  const [searchComCdOption, setSearchComCdOption] = useState("");
  const [searchComCdOptionValue, setSearchComCdOptionValue] = useState("");

  const defaultColumns = [
    setColumn({
      title: "코드값",
      key: "comId",
      // 추가한 로우에서만 수정되게 하기
      onCell: (record) => ({
        record,
        editable: record["status"] === "I" ? true : false,
        dataIndex: "comId",
        title: "코드ID",
        handleCellSave,
        max: 25,
      }),
    }),
    setColumn({ title: "코드명", key: "name", editable: true, max: 30 }),
    setColumn({ title: "생성일", key: "createdAt" }),
    setColumn({ title: "생성자", key: "createdUser" }),
    setColumn({ title: "수정일", key: "updatedAt" }),
    setColumn({ title: "수정자", key: "updatedUser" }),
    setColumn({
      title: "상세",
      key: "DetailComcd",
      render: (text, record, _) =>
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        record.createdAt ? (
          <Button
            icon={<CaretRightOutlined className="table-btn-icon" />}
            onClick={() => navigate(`/admin/manageComCd/${record.comId}`)}
            // shape="circle"
          />
        ) : (
          ""
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
      const { comCd, totalCount, comboPerPage, comboComCdOption } =
        await getManageComCd(
          currentPage,
          perPage,
          searchComCdOption,
          searchComCdOptionValue
        );

      setDataSource(comCd);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);

      setComboComCdOption(comboComCdOption);
      setSearchComCdOption(comboComCdOption[0].value ?? "");

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
            if (row.comId === "-") {
              isShowModal = true;
              throw Error(
                `${index + 1}번째줄의 코드ID을 입력해주세요. ('-', 공백 불가)`
              );
            }
            if (row.name === "-") {
              isShowModal = true;
              throw Error(
                `${index + 1}번째줄의 코드명을 입력해주세요. ('-', 공백 불가)`
              );
            }

            fetchData.push(row);
          }
          break;
        }
      });

      if (fetchData.length === 0) return;
      const { message } = await postManageComCd(fetchData);
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

          if (row.status !== "I") fetchData.push({ comId: row.comId });

          break;
        }
      });

      if (fetchData.length > 0) {
        const { message } = await patchManageComCd(fetchData);
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
      comId: "-",
      name: "-",
      createdAt: null,
      createdUser: null,
      updatedAt: null,
      updatedUser: null,
      status: "I",
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
    debugger;
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
      <span>공통코드</span>
      <Select
        style={{
          width: 100,
        }}
        value={searchComCdOption}
        onChange={(value) => {
          setSearchComCdOption(value);
        }}
        options={[...comboComCdOption]}
      />
      <Input onChange={(e) => setSearchComCdOptionValue(e.target.value)} />
    </AppTable>
  );
}

export default ManageComCd;
