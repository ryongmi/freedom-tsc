import { Card, Pagination, Space, Table } from "antd";
import React from "react";

import { components } from "./Components";
import TableButton from "./TableButton";

import "../../styles/table.css";

function AppTable({
  defaultColumns,
  dataSource,
  comboPerPage,
  selectedRowKeys,
  currentPage,
  totalCount,
  handleCellSave,
  onSelectChange,
  getCheckboxProps,
  handleItemAdd,
  handleItemRemove,
  handleSearch,
  handleSave,
  handleDelete,
  handleWarn,
  handleUnWarn,
  handleBan,
  handleUnBan,
  handlePagingChange,
  menuName = "검색조건",
  handlePostMove,
  handlePostNew,
  children,
}) {
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

  return (
    <>
      {children && (
        <Card title={menuName} bordered={false}>
          <Space>{children}</Space>
        </Card>
      )}
      <div className="table-content">
        <TableButton
          handleItemAdd={handleItemAdd}
          handleItemRemove={handleItemRemove}
          handleSearch={handleSearch}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleWarn={handleWarn}
          handleUnWarn={handleUnWarn}
          handleBan={handleBan}
          handleUnBan={handleUnBan}
          handlePostMove={handlePostMove}
          handlePostNew={handlePostNew}
        />
        {onSelectChange ? (
          <Table
            components={components}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps,
            }}
            // bordered
          />
        ) : (
          <Table
            components={components}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            // bordered
          />
        )}
        <Pagination
          className="pagination"
          current={currentPage}
          total={totalCount}
          onChange={handlePagingChange}
          pageSizeOptions={comboPerPage}
          showSizeChanger
        />
      </div>
    </>
  );
}

export default AppTable;
