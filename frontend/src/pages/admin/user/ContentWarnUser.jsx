import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import AppTable from "../../../components/table/AppTable";
import { setColumn } from "../../../components/table/SetColumn";

import { getContentWarnUser, patchUnWarnUser } from "../../../services/apiUser";

function ContentWarnUser() {
  const { userId } = useParams();
  const { showMessage } = useOutletContext();

  // 기본
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(null);

  const defaultColumns = [
    setColumn({
      title: "별명(아이디)",
      key: "userName",
      onCell: (_, index) => {
        if (index === 0) {
          return {
            rowSpan: dataSource.length,
          };
        } else {
          return {
            rowSpan: 0,
          };
        }
      },
    }),
    setColumn({
      title: "게시물URL",
      key: "postUrl",
      render: (text) => (
        <Link to={text} target="_blank">
          {text}
        </Link>
      ),
    }),
    setColumn({ title: "사유", key: "warnReason" }),
    setColumn({ title: "처리일", key: "createdAt" }),
    setColumn({ title: "처리자", key: "createdUser" }),
    setColumn({ title: "경고해제일", key: "unWarnAt" }),
    setColumn({ title: "경고취소자", key: "unWarnUser" }),
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
      const { contents, totalCount, comboPerPage } = await getContentWarnUser(
        userId,
        currentPage,
        perPage
      );

      // 기본
      setDataSource(contents);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);

      //초기화
      setSelectedRowKeys([]);

      showMessage("조회성공!");
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  async function handleUnWarn() {
    if (selectedRowKeys.length === 0) {
      showMessage("경고해제할 항목을 선택해주세요!", "warning");
      return;
    }

    try {
      const fetchData = [];
      selectedRowKeys.forEach((key) => {
        for (let index = 0; index < dataSource.length; index++) {
          const row = dataSource[index];
          if (row.key !== key) continue;

          fetchData.push({ warnId: row.warnId });

          break;
        }
      });

      if (fetchData.length === 0) return;

      const { message } = await patchUnWarnUser(fetchData, userId);

      showMessage(message);
      await handleSearch();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  // Table CheckBox Click Event
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const getCheckboxProps = (record) => ({
    disabled: record.unWarnAt !== null,
    // Column configuration not to be checked
  });

  // Table Paging Event
  async function handlePagingChange(page, pageSize) {
    // 로우 수 보여주는 콤보박스 및 페이지 변경 이벤트
    setCurrentPage(page);
    setPerPage(pageSize);
  }

  return (
    <AppTable
      defaultColumns={defaultColumns}
      dataSource={dataSource}
      comboPerPage={comboPerPage}
      selectedRowKeys={selectedRowKeys}
      onSelectChange={onSelectChange}
      getCheckboxProps={getCheckboxProps}
      handleUnWarn={handleUnWarn}
      currentPage={currentPage}
      totalCount={totalCount}
      handlePagingChange={handlePagingChange}
    ></AppTable>
  );
}

export default ContentWarnUser;
