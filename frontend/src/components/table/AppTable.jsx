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
        <Card title="검색조건" bordered={false}>
          <Space size={"middle"}>{children}</Space>
        </Card>
      )}
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
      />
      <Table
        className="table-content"
        components={components}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps,
        }}
        bordered
      />
      <Pagination
        className="pagination table-content"
        current={currentPage}
        total={totalCount}
        onChange={handlePagingChange}
        pageSizeOptions={comboPerPage}
        showSizeChanger
      />
    </>
  );
}

export default AppTable;