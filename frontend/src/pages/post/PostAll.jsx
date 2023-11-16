import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button, Divider, Input, Select, Space, DatePicker } from "antd";

import AppTable from "../../components/table/AppTable";
import { setColumn } from "../../components/table/SetColumn";

import { getPostAll, patchPost } from "../../services/apiPost";

import { useSelector } from "react-redux";
import "../../styles/post.css";

const { RangePicker } = DatePicker;

function PostAll() {
  const { adminFlag } = useSelector((store) => store.user);
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { showMessage, showModal } = useOutletContext();

  // 기본
  const [dataSource, setDataSource] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [comboPerPage, setComboPerPage] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(null);

  // 콤보박스 아이템
  const [comboDateOption, setComboDateOption] = useState([]);
  const [comboPostOption, setComboPostOption] = useState([]);

  // 검색조건
  const [searchDateOpen, setSearchDateOpen] = useState(false);
  const [searchDateValue, setSearchDateValue] = useState([]);
  const [searchDateOption, setSearchDateOption] = useState("ALL");
  const [searchPostValue, setSearchPostValue] = useState("");
  const [searchPostOption, setSearchPostOption] = useState("TITLE");

  const defaultColumns = [
    setColumn({
      key: "menuName",
      width: "10%",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <a
          className="post-link-title"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/post/${record.menuId}`);
          }}
        >
          <span>{text}</span>
        </a>
      ),
    }),
    setColumn({
      title: "제목",
      key: "title",
      width: "60%",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <div className="post-title">
          <a
            className="post-link-title"
            onClick={(e) => {
              e.preventDefault();
              navigate(`${record.menuId}/${record.postId}`);
            }}
          >
            {record.bracket && (
              <span className="post-link-bracket">
                [{record.bracket}]&nbsp;
              </span>
            )}
            <span>{text}</span>
          </a>
          {record.commentCount > 0 && (
            <a
              // href={`/post/${menuId}/${record.postId}#comment-container`}
              className="post-link-comment"
              onClick={(e) => {
                e.preventDefault();
                navigate(`${record.menuId}/${record.postId}`);
              }}
            >
              <span>&nbsp;[{record.commentCount}]</span>
            </a>
          )}
        </div>
      ),
    }),
    setColumn({
      title: "작성자",
      key: "createdUser",
      width: "10%",
      render: (text, record, _) => (
        // (text, record, index)
        // text : data값, record: 선택한 row값 배열, index: 선택한 row index
        <a className="post-link-title">
          <span>{text}</span>
        </a>
      ),
    }),
    setColumn({ title: "작성일", key: "createdAt", width: "10%" }),
    setColumn({ title: "조회", key: "view", width: "5%" }),
    setColumn({ title: "좋아요", key: "crAt", width: "5%" }),
  ];

  useEffect(() => {
    async function fetchData() {
      await handleSearch();
    }
    fetchData();
  }, [currentPage, perPage, menuId]);

  // Table Button Event
  async function handleSearch() {
    try {
      const {
        post,
        totalCount,
        comboPerPage,
        comboDateOption,
        comboPostOption,
      } = await getPostAll(
        currentPage,
        perPage,
        searchDateValue,
        searchDateOption,
        searchPostValue,
        searchPostOption
      );

      setDataSource(post);
      setTotalCount(totalCount);
      setComboPerPage(comboPerPage);

      setSelectedRowKeys([]);

      setComboDateOption(comboDateOption);
      setComboPostOption(comboPostOption);
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  // 삭제 버튼
  async function handleDelete() {
    if (selectedRowKeys.length === 0) {
      showModal("데이터 미체크", "삭제할 게시글을 선택해주세요.");
      return;
    }

    try {
      const fetchData = [];
      selectedRowKeys.forEach((key) => {
        for (let index = 0; index < dataSource.length; index++) {
          const row = dataSource[index];
          if (row.key !== key) continue;

          fetchData.push({
            menuId: row.menuId,
            postId: row.postId,
          });
          break;
        }
      });

      if (fetchData.length === 0) return;
      const { message } = await patchPost(fetchData);

      showMessage(message);
      await handleSearch();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  // 글쓰기 버튼
  function handlePostNew() {
    navigate("/post/edit");
  }

  // Table CheckBox Click Event
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 로우 수 보여주는 콤보박스 및 페이지 변경 이벤트
  function handlePagingChange(page, pageSize) {
    setCurrentPage(page);
    setPerPage(pageSize);
  }

  // 날짜 지정 콤보박스
  function handleSelectChange(value) {
    setSearchDateOption(value);
    setSearchDateOpen((open) => !open);
  }

  // 날짜 지정
  function handlePickerChange(value, dateString) {
    setSearchDateValue(dateString);
  }

  // 날짜 설정 버튼 이벤트
  function handleSetDateClick(e) {
    setSearchDateOption("기간지정");
    setSearchDateOpen(false);
  }

  return (
    <AppTable
      defaultColumns={defaultColumns}
      dataSource={dataSource}
      comboPerPage={comboPerPage}
      selectedRowKeys={selectedRowKeys}
      onSelectChange={adminFlag === "Y" ? onSelectChange : null}
      currentPage={currentPage}
      totalCount={totalCount}
      menuName="전체글보기"
      handlePagingChange={handlePagingChange}
      handleDelete={adminFlag === "Y" ? handleDelete : null}
      handlePostNew={handlePostNew}
    >
      <Select
        value={searchDateOption}
        onSelect={handleSelectChange}
        open={searchDateOpen}
        onDropdownVisibleChange={(visible) => setSearchDateOpen(visible)}
        style={{
          width: searchDateOpen ? 320 : 100,
        }}
        dropdownRender={(menu) => (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {menu}
            <Divider
              style={{
                margin: "8px 0",
              }}
            />
            <Space
              direction="vertical"
              style={{
                padding: "0 8px 4px",
              }}
            >
              <Space>
                <span>기간 입력</span>
              </Space>
              <Space>
                <RangePicker onChange={handlePickerChange} />
                <Button onClick={handleSetDateClick}>설정</Button>
              </Space>
            </Space>
          </div>
        )}
        options={comboDateOption}
      />
      <Select
        style={{
          width: 100,
        }}
        value={searchPostOption}
        onChange={(value) => {
          setSearchPostOption(value);
        }}
        options={comboPostOption}
      />
      <Input
        placeholder="검색어를 입력해주세요"
        onChange={(e) => setSearchPostValue(e.target.value)}
      />
      <Button onClick={handleSearch}>검색</Button>
    </AppTable>
  );
}

export default PostAll;
