import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, Input, Select } from "antd";

import AppTable from "../../../components/table/AppTable";
import { setColumn } from "../../../components/table/SetColumn";

import { getManageBanUser } from "../../../services/apiUser";

function ManageBanUser() {
  const { showMessage } = useOutletContext();
  const navigate = useNavigate();

  // 기본
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(null);

  // 콤보박스 아이템
  const [comboUserOption, setComboUserOption] = useState([]);

  // 검색조건
  const [searchUserOption, setSearchUserOption] = useState("ID");
  const [searchUserOptionValue, setSearchUserOptionValue] = useState("");

  const defaultColumns = [
    setColumn({ title: "별명(아이디)", key: "userName" }),
    setColumn({ title: "권한", key: "authName" }),
    setColumn({ title: "트위치타입", key: "twitchType" }),
    setColumn({ title: "스트리머타입", key: "broadcasterType" }),
    setColumn({ title: "경고횟수(총횟수)", key: "banCount" }),
    setColumn({ title: "처리일", key: "createdAt" }),
    setColumn({ title: "처리자", key: "createdUser" }),
    setColumn({
      title: "사유",
      key: "reason",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <Button
          onClick={() => navigate(`/admin/manageBanUser/${record.userId}`)}
        >
          확인
        </Button>
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
      const { user, totalCount, comboPerPage, comboUserOption } =
        await getManageBanUser(
          currentPage,
          perPage,
          searchUserOption,
          searchUserOptionValue
        );

      // 기본
      setDataSource(user);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);

      // 사용할 콤보박스 아이템
      setComboUserOption(comboUserOption);

      //초기화
      setSelectedRowKeys([]);

      showMessage("조회성공!");
    } catch (error) {
      showMessage(error.message, "error");
    }
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
  return (
    <AppTable
      defaultColumns={defaultColumns}
      dataSource={dataSource}
      comboPerPage={comboPerPage}
      selectedRowKeys={selectedRowKeys}
      onSelectChange={onSelectChange}
      handleSearch={handleSearch}
      currentPage={currentPage}
      totalCount={totalCount}
      handlePagingChange={handlePagingChange}
    >
      <Select
        style={{
          width: 130,
        }}
        value={searchUserOption}
        onChange={(value) => {
          setSearchUserOption(value);
        }}
        options={comboUserOption}
      />
      <Input
        placeholder="검색어를 입력해주세요"
        onChange={(e) => setSearchUserOptionValue(e.target.value)}
      />
    </AppTable>
  );
}

export default ManageBanUser;
