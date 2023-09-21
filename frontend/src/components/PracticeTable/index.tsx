'use client';
import { useState } from 'react';
import type { Key } from 'react';
import { Button, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  button: string;
  select: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text, row, index) => {
      if (index % 3 === 0) {
        return {
          children: text,
          props: {
            rowSpan: 3,
            style: { background: 'white', $hover: { background: 'black' } },
          },
        };
      }
      if (index % 3 === 1) {
        return {
          props: {
            rowSpan: 0,
          },
        };
      }
      if (index % 3 === 2) {
        return {
          props: {
            rowSpan: 0,
          },
        };
      }
    },
  },

  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Button',
    dataIndex: 'button',
    render: (value: string) => <Button>{value}</Button>,
  },
  {
    title: 'Select',
    dataIndex: 'select',
    render: (value: string, _, index) => (
      <Select
        disabled={index % 2 === 1}
        defaultValue={{ value: 'lucy', label: 'Lucy (101)' }}
        options={[
          {
            value: 'jack',
            label: 'Jack (100)',
          },
          {
            value: 'lucy',
            label: 'Lucy (101)',
          },
        ]}
      >
        {value}
      </Select>
    ),
  },
];

const data: DataType[] = [];
for (let i = 1; i <= 100; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
    button: '버튼',
    select: '콤보박스',
  });
}

export default function PracticeTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        <Button type="primary" loading={loading}>
          저장
        </Button>
        <Button type="primary" loading={loading}>
          삭제
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
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
