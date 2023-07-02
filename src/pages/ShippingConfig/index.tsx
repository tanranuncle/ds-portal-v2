import ShippingConfigCUMF from '@/pages/ShippingConfig/component/cumf';
import {
  addChannel,
  ChannelType,
  deleteChannel,
  getChannelList,
  shippingCompanyEnum,
  updateChannel,
} from '@/services/apis/logistic';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();

  const handleAdd = async (params: ChannelType) => {
    return addChannel(params).then((x) => {
      if (x.code === 200) {
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      } else {
        return false;
      }
    });
  };

  const handleDelete = async (key, params: ChannelType) => {
    return deleteChannel(params).then((x) => {
      if (x.code === 200) {
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      } else {
        return false;
      }
    });
  };

  const handleUpdate = async (key, params: ChannelType) => {
    return updateChannel(params).then((x) => {
      if (x.code === 200) {
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      } else {
        return false;
      }
    });
  };

  const columns: ProColumns<ChannelType>[] = [
    {
      title: '物流公司',
      dataIndex: 'company',
      valueType: 'select',
      valueEnum: shippingCompanyEnum,
    },
    {
      title: '渠道',
      dataIndex: 'name',
      search: false,
      width: '15%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '运输代码',
      dataIndex: 'code',
      tooltip: '运输代码',
      width: '15%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '截件时间',
      dataIndex: 'cutOffTime',
      search: false,
    },
    {
      title: '参考时效',
      dataIndex: 'costTime',
      search: false,
    },
    {
      title: '操作',
      width: 150,
      valueType: 'option',
      render: (text, record, _, action) => [
        <Link key="enterPriceTable" to={'/admin/config/detail/' + record.code}>
          进入价格表
        </Link>,
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.recId);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ChannelType>
        actionRef={actionRef}
        rowKey="recId"
        headerTitle="渠道列表"
        scroll={{
          x: 960,
        }}
        loading={false}
        toolBarRender={() => [
          <ShippingConfigCUMF
            key={'add'}
            onFinish={handleAdd}
            trigger={
              <Button type={'primary'} icon={<PlusOutlined />}>
                添加渠道
              </Button>
            }
            title={'编辑'}
          />,
        ]}
        columns={columns}
        request={getChannelList}
        editable={{
          type: 'single',
          onDelete: handleDelete,
          onSave: handleUpdate,
        }}
      />
    </PageContainer>
  );
};
