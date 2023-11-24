import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Button, Drawer, Input, Select, Space } from "antd";

import AppTable from "../../../components/table/AppTable";
import { setColumn } from "../../../components/table/SetColumn";

import {
  getManageUser,
  patchManageUser,
  postBanUser,
  postWarnUser,
} from "../../../services/apiUser";

function ManageUser() {
  const { showMessage } = useOutletContext();

  // 기본
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // 콤보박스 아이템
  const [comboUserOption, setComboUserOption] = useState([]);
  const [comboAuth, setComboAuth] = useState([]);
  const [comboUserStatus, setComboUserStatus] = useState([]);

  // 검색조건
  const [searchUserOption, setSearchUserOption] = useState("");
  const [searchUserOptionValue, setSearchUserOptionValue] = useState("");
  const [searchUserAuthId, setSearchUserAuthId] = useState("ALL");
  const [searchUserStatus, setSearchUserStatus] = useState("ALL");

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawer, setDrawer] = useState("");
  const [drawerUrl, setDrawerUrl] = useState("");
  const [drawerReason, setDrawerReason] = useState("");

  const defaultColumns = [
    setColumn({ title: "별명(아이디)", key: "userName" }),
    setColumn({
      title: "권한",
      key: "authId",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <Select
          style={{
            width: 130,
          }}
          defaultValue={text}
          onChange={(value) => {
            record = { ...record, authId: value };
            handleCellSave(record, "authId");
          }}
          options={comboAuth}
        />
      ),
    }),
    setColumn({ title: "트위치타입", key: "twitchType" }),
    setColumn({ title: "스트리머타입", key: "broadcasterType" }),
    setColumn({ title: "가입일", key: "createdAt" }),
    setColumn({ title: "최종방문일", key: "lastLoginAt" }),
    setColumn({ title: "방문횟수", key: "visit" }),
    setColumn({ title: "게시글수", key: "post" }),
    setColumn({ title: "댓글수", key: "comment" }),
    setColumn({ title: "수정일", key: "updatedAt" }),
    setColumn({ title: "수정자", key: "updatedUser" }),
    // setColumn({ title: "상태", key: "userStatus" }),
    setColumn({
      title: "상태",
      key: "userStatus",
      render: (text, record) =>
        text === "경고" ? (
          <Link
            className="table-user-status"
            to={`/admin/manageWarnUser/${record.userId}`}
          >
            {text}
          </Link>
        ) : text === "밴" ? (
          <Link
            className="table-user-status"
            to={`/admin/manageBanUser/${record.userId}`}
          >
            {text}
          </Link>
        ) : (
          text
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
      const {
        user,
        totalCount,
        comboPerPage,
        comboAuth,
        comboUserStatus,
        comboUserOption,
      } = await getManageUser(
        currentPage,
        perPage,
        searchUserOption,
        searchUserOptionValue,
        searchUserAuthId,
        searchUserStatus
      );

      // 기본
      setDataSource(user);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);

      // 사용할 콤보박스 아이템
      setComboUserOption(comboUserOption);
      setComboAuth(comboAuth);
      setComboUserStatus(comboUserStatus);

      //초기화
      setSelectedRowKeys([]);

      showMessage("조회성공!");
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  async function handleSave() {
    if (selectedRowKeys.length === 0) {
      showMessage("저장할 유저를 선택해주세요!", "warning");
      return;
    }

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

      if (fetchData.length === 0) return;

      const { message } = await patchManageUser(fetchData);
      showMessage(message);
      await handleSearch();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  async function handleWarn() {
    if (drawerReason.trim() === "") {
      showMessage("사유를 입력해주세요!(사유는 필수입력입니다)", "warning");
      return;
    }

    if (selectedRowKeys.length === 0) {
      showMessage("경고할 유저를 선택해주세요!", "warning");
      return;
    }

    try {
      const fetchData = [];
      selectedRowKeys.forEach((key) => {
        for (let index = 0; index < dataSource.length; index++) {
          const row = dataSource[index];
          if (row.key !== key) continue;

          fetchData.push({ userId: row.userId });

          break;
        }
      });

      if (fetchData.length === 0) return;

      const { message } = await postWarnUser(
        fetchData,
        drawerUrl,
        drawerReason
      );

      onDrawerClose();
      showMessage(message);
      await handleSearch();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  async function handleBan() {
    if (drawerReason.trim() === "") {
      showMessage("사유를 입력해주세요!(사유는 필수입력입니다)", "warning");
      return;
    }

    if (selectedRowKeys.length === 0) {
      showMessage("밴할 유저를 선택해주세요!", "warning");
      return;
    }

    try {
      const fetchData = [];
      selectedRowKeys.forEach((key) => {
        for (let index = 0; index < dataSource.length; index++) {
          const row = dataSource[index];
          if (row.key !== key) continue;

          fetchData.push({ userId: row.userId });

          break;
        }
      });

      if (fetchData.length === 0) return;

      const { message } = await postBanUser(fetchData, drawerUrl, drawerReason);

      onDrawerClose();
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

  const showDrawer = (openDrawerCheck) => {
    if (selectedRowKeys.length === 0) {
      showMessage(
        `${openDrawerCheck === "BAN" ? "밴" : "경고"}할 유저를 선택해주세요!`,
        "warning"
      );
      return;
    }
    setDrawer(openDrawerCheck);
    setDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setDrawerUrl("");
    setDrawerReason("");
    setDrawerOpen(false);
  };

  return (
    <>
      <AppTable
        defaultColumns={defaultColumns}
        dataSource={dataSource}
        handleCellSave={handleCellSave}
        comboPerPage={comboPerPage}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
        handleSearch={handleSearch}
        handleSave={handleSave}
        handleWarn={() => {
          showDrawer("WARN");
        }}
        handleBan={() => {
          showDrawer("BAN");
        }}
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
        <span>권한</span>
        <Select
          style={{
            width: 130,
          }}
          value={searchUserAuthId}
          onChange={(value) => {
            setSearchUserAuthId(value);
          }}
          options={[{ value: "ALL", label: "ALL" }, ...comboAuth]}
        />
        <span>상태</span>
        <Select
          style={{
            width: 80,
          }}
          value={searchUserStatus}
          onChange={(value) => {
            setSearchUserStatus(value);
          }}
          options={[{ value: "ALL", label: "ALL" }, ...comboUserStatus]}
        />
      </AppTable>

      <Drawer
        title={`${drawer === "BAN" ? "밴" : "경고"} 내용 입력`}
        width={500}
        onClose={onDrawerClose}
        open={drawerOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onDrawerClose}>취소</Button>
            <Button
              onClick={drawer === "BAN" ? handleBan : handleWarn}
              type="primary"
            >
              저장
            </Button>
          </Space>
        }
      >
        <span>URL</span>
        <Input
          placeholder="게시글 URL을 입력해주세요"
          value={drawerUrl}
          onChange={(e) => setDrawerUrl(e.target.value)}
        />
        <br />
        <br />
        <span>사유</span>
        <Input.TextArea
          showCount
          rows={4}
          placeholder="사유를 입력해주세요"
          maxLength={100}
          value={drawerReason}
          onChange={(e) => setDrawerReason(e.target.value)}
        />
      </Drawer>
    </>
  );
}

export default ManageUser;
