'use client';
import { useState } from 'react';
import type { Key } from 'react';
import { Button, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { isEmpty } from 'lodash-es';

interface DataType {
  key: number;
  userName: string; // 별명(이름)
  authId: string; // 권한
  twitchType: string; // 트위치 타입
  broadCasterType: string; // 스트리머 타입
  warnCount: string; // 횟수
  createdAt: string; // 처리일
  updatedAt: string; // 처리자
  userId: string; // 사유
}

const columns: ColumnsType<DataType> = [
  {
    title: '별명(이름)',
    dataIndex: 'userName',
  },
  {
    title: '권한',
    dataIndex: 'authId',
    render: (value: string) => (
      <Select
        disabled={true}
        defaultValue={value}
        options={[
          {
            value: '1',
            label: '사용자',
          },
          {
            value: '2',
            label: '관리자',
          },
        ]}
      />
    ),
  },
  {
    title: '트위치 타입',
    dataIndex: 'twitchType',
  },
  {
    title: '스트리머 타입',
    dataIndex: 'broadCasterType',
  },
  {
    title: '횟수',
    dataIndex: 'warnCount',
  },
  {
    title: '처리일',
    dataIndex: 'createdAt',
  },
  {
    title: '처리자',
    dataIndex: 'updatedAt',
  },
  {
    title: '사유',
    dataIndex: 'userId',
    render: (value: string) => (
      <Button
        onClick={() => {
          console.log(value);
        }}
      >
        확인하기
      </Button>
    ),
  },
].map((el) => ({ ...el, align: 'center' }));

const data: DataType[] = [];
for (let i = 1; i <= 100; i++) {
  data.push({
    key: i,
    userName: '이름',
    authId: `${i % 2 === 0 ? 1 : 2}`,
    twitchType: '일반 사용자',
    broadCasterType: '시청자',
    warnCount: `${i} 번`,
    createdAt: '2023년 10월 10일',
    updatedAt: '테스트',
    userId: `${i}`, // 유저 ID로 집어넣으면 됨
  });
}

export default function AlertUserManagementTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
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
          <Button type="primary">경고 해지</Button>
          <Button type="primary">벤</Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
