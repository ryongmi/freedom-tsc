import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, Drawer, Input, Select, Space } from "antd";

import AppTable from "../../../components/table/AppTable";
import { setColumn } from "../../../components/table/SetColumn";

import { getManageWarnUser, postBanUser } from "../../../services/apiUser";

function ManageWarnUser() {
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

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerUrl, setDrawerUrl] = useState("");
  const [drawerReason, setDrawerReason] = useState("");

  const defaultColumns = [
    setColumn({ title: "별명(아이디)", key: "userName" }),
    setColumn({ title: "권한", key: "authName" }),
    setColumn({ title: "트위치타입", key: "twitchType" }),
    setColumn({ title: "스트리머타입", key: "broadcasterType" }),
    setColumn({ title: "경고횟수(총횟수)", key: "warnCount" }),
    setColumn({ title: "처리일", key: "createdAt" }),
    setColumn({ title: "처리자", key: "createdUser" }),
    setColumn({
      title: "사유",
      key: "reason",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <Button
          onClick={() => navigate(`/admin/manageWarnUser/${record.userId}`)}
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
        await getManageWarnUser(
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

  const showDrawer = () => {
    if (selectedRowKeys.length === 0) {
      showMessage("밴할 유저를 선택해주세요!", "warning");
      return;
    }

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
        comboPerPage={comboPerPage}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
        handleSearch={handleSearch}
        handleBan={showDrawer}
        currentPage={currentPage}
        totalCount={totalCount}
        handlePagingChange={handlePagingChange}
      >
        <span>유저검색</span>
        <Select
          style={{
            width: 130,
          }}
          value={searchUserOption}
          onChange={(value) => {
            setSearchUserOption(value);
          }}
          options={[...comboUserOption]}
        />
        <Input onChange={(e) => setSearchUserOptionValue(e.target.value)} />
      </AppTable>

      <Drawer
        title="밴 내용 입력"
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
            <Button onClick={handleBan} type="primary">
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

export default ManageWarnUser;
