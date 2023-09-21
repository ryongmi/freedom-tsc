'use client';
import { useState } from 'react';
import type { Key } from 'react';
import { Button, Select, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { isEmpty } from 'lodash-es';
import Link from 'next/link';
import { MinusOutlined, PlusCircleFilled, PlusOutlined } from '@ant-design/icons';

interface DataType {
  key: number;
  comID: string; // 코드ID
  codeName: string; // 코드명
  createdAt: string; // 생성일
  createdUser: string; // 생성자
  updatedAt: string; // 수정일
  updatedUser: string; // 수정자
  useFlag: string; // 사용 유무
}

const data: DataType[] = [];
for (let i = 1; i <= 100; i++) {
  data.push({
    key: i,
    comID: '타입',
    codeName: '코드명',
    createdAt: '2023년 10월 10일',
    createdUser: `생성한 사람 ${i}`,
    updatedAt: '2023년 10월 10일',
    updatedUser: '수정자',
    useFlag: `${i % 2 === 0 ? 1 : 2}`,
  });
}

export default function CommonCodeManagemaneDetail() {
  const columns: ColumnsType<DataType> = [
    {
      title: '코드ID',
      dataIndex: 'comID',
    },
    {
      title: '코드명',
      dataIndex: 'codeName',
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
    },
    {
      title: '생성자',
      dataIndex: 'createdUser',
    },
    {
      title: '수정일',
      dataIndex: 'updatedAt',
    },
    {
      title: '수정자',
      dataIndex: 'updatedUser',
    },
    {
      title: '사용 유무',
      dataIndex: 'useFlag',
      render: (value: string) => (
        <Select
          style={{ width: 100 }}
          defaultValue={value}
          options={[
            {
              value: '1',
              label: '사용',
            },
            {
              value: '2',
              label: '미사용',
            },
          ]}
        />
      ),
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
          <Button
            type="primary"
            shape="circle"
            danger
            icon={<PlusOutlined style={{ fontSize: '20px' }} />}
          />
          <Button
            type="primary"
            shape="circle"
            danger
            icon={<MinusOutlined style={{ fontSize: '20px' }} />}
          />
          <span style={{ marginLeft: 8 }}>
            {!isEmpty(selectedRowKeys) ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary">저장</Button>

          <Button type="primary">삭제</Button>
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
