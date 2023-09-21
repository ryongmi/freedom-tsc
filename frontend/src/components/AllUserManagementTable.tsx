'use client';
import { useState, useEffect } from 'react';
import type { Key } from 'react';
import { Button, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { isEmpty } from 'lodash-es';
import Link from 'next/link';
import { useGetUsers } from '@/hooks/queries/useUsers';

interface DataType {
  key: number;
  USER_NAME: string; // 별명
  AUTH_ID: string; // 권한
  TWITCH_TYPE: string; // 트위치 타입
  BROADCASTER_TYPE: string; // 스트리머 타입
  CREATED_AT: string; // 가입일
  LAST_LOGIN_AT: string; // 최종 방문일
  UPDATED_AT: string | null; // 수정일
  UPDATED_USER: string | null; // 수정자
  USER_STATUS: string; // 상태
}

export default function AllUserManagementTable() {
  const { data: { comboAuth, comboPerPage, totalCount, users } = {} } = useGetUsers();

  useEffect(() => {
    console.log({ comboAuth, comboPerPage, totalCount, users });
  }, [comboAuth, comboPerPage, totalCount, users]);

  const columns: ColumnsType<DataType> = [
    {
      title: '별명(이름)',
      dataIndex: 'USER_NAME',
    },
    {
      title: '권한',
      dataIndex: 'AUTH_ID',
      render: (value: string) => {
        return <Select defaultValue={value} options={comboAuth} />;
      },
    },
    {
      title: '트위치 타입',
      dataIndex: 'TWITCH_TYPE',
    },
    {
      title: '스트리머 타입',
      dataIndex: 'BROADCASTER_TYPE',
    },
    {
      title: '가입일',
      dataIndex: 'CREATED_AT',
    },
    {
      title: '최종 방문일',
      dataIndex: 'LAST_LOGIN_AT',
    },
    {
      title: '수정일',
      dataIndex: 'UPDATED_AT',
    },
    {
      title: '수정자',
      dataIndex: 'UPDATED_USER',
    },
    {
      title: '상태',
      dataIndex: 'USER_STATUS',
      // 상태값 별로 글자 색상이 변함
      // 나중에 해당 페이지 이동 + value로 api호출 되게끔 변경
      render: (value: string) => <Link href={value}>{value}</Link>,
    },
  ].map((el) => ({ ...el, align: 'center' }));

  const data: DataType[] = [];
  for (let i = 1; i <= 100; i++) {
    data.push({
      key: i,
      USER_NAME: '이름',
      AUTH_ID: `${i % 2 === 0 ? 1 : 2}`,
      TWITCH_TYPE: '일반 사용자',
      BROADCASTER_TYPE: '시청자',
      CREATED_AT: '2023년 10월 10일',
      LAST_LOGIN_AT: '2023년 10월 10일',
      UPDATED_AT: '2023년 10월 10일',
      UPDATED_USER: '테스트',
      USER_STATUS: '정상',
    });
  }

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
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginLeft: 8 }}>
            {!isEmpty(selectedRowKeys) ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary">경고</Button>
          <Button type="primary">벤</Button>
          <Button type="primary">저장</Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users?.map((el: any) => ({ ...el, key: el.USER_ID }))}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
