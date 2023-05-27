import { addChannel, ChannelType, getChannelList } from '@/services/apis/logistic';
import type { ProColumns } from '@ant-design/pro-components';
import { ActionType, EditableProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import React, { useRef, useState } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ChannelType>[] = [
    {
      title: '渠道',
      dataIndex: 'name',
      tooltip: '渠道名称',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      // 第一行不允许编辑
      // editable: (text, record, index) => {
      //   return index !== 0;
      // },
      width: '15%',
    },
    {
      title: '运输代码',
      dataIndex: 'code',
      tooltip: '代码',
      //   readonly: true,
      width: '15%',
    },
    {
      title: '物流公司',
      dataIndex: 'company',
      valueType: 'select',
      valueEnum: {
        // all: { text: '全部', status: 'Default' },
        yuntu: {
          text: '云途物流',
        },
        ubi: {
          text: 'UBI',
        },
      },
    },
    {
      title: '截件时间',
      dataIndex: 'cutOffTime',
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
      dataIndex: 'costTime',
    },
    {
      title: '价格表',
      valueType: 'option',
      width: 200,
      render: (_, row) => [
        <Link key="editable" to={'/admin/config/detail/' + row.recId}>
          进入价格表
        </Link>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable<ChannelType>
        actionRef={actionRef}
        rowKey="recId"
        headerTitle="可编辑表格"
        maxLength={10}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={{
          position: 'bottom',
          record: () => ({ recId: (Math.random() * 1000000).toFixed(0) }),
        }}
        loading={false}
        toolBarRender={() => []}
        columns={columns}
        request={getChannelList}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            addChannel(data).then((x) => {
              if (x.code === 200) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            });
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};
