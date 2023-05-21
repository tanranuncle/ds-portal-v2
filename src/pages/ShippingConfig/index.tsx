import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import React, { useState } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  title?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '云途全球专线挂号（特惠带电）',
    readonly: 'THZXR',
    decs: '09:00',
    state: '云途物流',
    created_at: '5-15工作日',
    update_at: '1590486176000',
  },
  {
    id: 624691229,
    title: '云途全球专线平邮（特惠带电）',
    readonly: 'THZXU',
    decs: '09:00',
    state: '云途物流',
    created_at: '5-15工作日',
    update_at: '1590481162000',
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '渠道',
      dataIndex: 'title',
      tooltip: '只读，使用form.getFieldValue获取不到值',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      // 第一行不允许编辑
      editable: (text, record, index) => {
        return index !== 0;
      },
      width: '15%',
    },
    {
      title: '运输代码',
      dataIndex: 'readonly',
      tooltip: '只读，使用form.getFieldValue可以获取到值',
      //   readonly: true,
      width: '15%',
    },
    {
      title: '物流公司',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        // all: { text: '全部', status: 'Default' },
        open: {
          text: '云途物流',
          status: 'Error',
        },
        closed: {
          text: 'UBI',
          status: 'Success',
        },
      },
    },
    {
      title: '截件时间',
      dataIndex: 'decs',
      fieldProps: (form, { rowKey, rowIndex }) => {
        if (form.getFieldValue([rowKey || '', 'title']) === '不好玩') {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: '参考时效',
      dataIndex: 'created_at',
    },
    {
      title: '价格表',
      valueType: 'option',
      width: 200,
      render: () => [
        <Link key="editable" to="/admin/config/detail">
          进入价格表
        </Link>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="可编辑表格"
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={
          position !== 'hidden'
            ? {
                position: position as 'top',
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
              }
            : false
        }
        loading={false}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value),
            }}
            options={[
              {
                label: '添加到顶部',
                value: 'top',
              },
              {
                label: '添加到底部',
                value: 'bottom',
              },
              {
                label: '隐藏',
                value: 'hidden',
              },
            ]}
          />,
        ]}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
        }}
      />
      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};
