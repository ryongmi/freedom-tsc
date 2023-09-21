'use client';
import { useState } from 'react';
import type { Key } from 'react';
import { Button, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { isEmpty } from 'lodash-es';
import Link from 'next/link';
import './style.css';

interface DataType {
  key: number;
  userName: string; // 별명(이름)
  url: string; // 게시물 URL
  warnReason: string; // 사유
  createdAt: string; // 처리일
  createdUser: string; // 처리자
  unWarnAt: string; // 경고 해제일
  unWarnUser: string; // 경고 취소자
}

const data: DataType[] = [];
for (let i = 1; i <= 100; i++) {
  data.push({
    key: i,
    userName: '이름',
    url: `https://www.naver.com`,
    warnReason: '그냥',
    createdAt: '2023년 10월 10일',
    createdUser: `권력자`,
    unWarnAt: '2023년 10월 10일',
    unWarnUser: '권력자',
  });
}

export default function AlertUserReasonCheck() {
  const columns: ColumnsType<DataType> = [
    {
      title: '별명(이름)',
      dataIndex: 'userName',
      onCell: (_: any, index: any) => {
        return {
          rowSpan: index % pageSize === 0 ? pageSize : 0,
          className: 'second-column',
        };
      },
    },
    {
      title: '게시물 URL',
      dataIndex: 'url',
      render: (value: string) => <Link href={value}>{value}</Link>,
    },
    {
      title: '사유',
      dataIndex: 'warnReason',
    },
    {
      title: '처리일',
      dataIndex: 'createdAt',
    },
    {
      title: '처리자',
      dataIndex: 'createdUser',
    },
    {
      title: '경고 해제일',
      dataIndex: 'unWarnAt',
    },
    {
      title: '경고 취소자',
      dataIndex: 'unWarnUser',
    },
  ].map((el) => ({ ...el, align: 'center' }));

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [pageSize, setPageSize] = useState(5);

  return (
    <div>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginLeft: 8 }}>
            {!isEmpty(selectedRowKeys) ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary">경고 해제</Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize,
          onChange: (_: number, pageSize: number) => {
            setPageSize(pageSize);
          },
        }}
        rowClassName={() => 'rowClassName1'}
      />
    </div>
  );
}
