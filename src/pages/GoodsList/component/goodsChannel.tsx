import {
  deleteGoodsChannel,
  editOrUpdateGoodsChannel,
  getGoodsChannels,
} from '@/services/apis/goods';
import { CountryOptions } from '@/services/apis/logistic';
import { ActionType, ModalForm, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Form, message, Select } from 'antd';
import React, { useRef } from 'react';

export type GoodsChannelTableParams = {
  goodsId: number;
};
const GoodsChannelTable: React.FC<GoodsChannelTableParams> = ({ goodsId }) => {
  const actionRef = useRef<ActionType>();

  const handleUpdateOrEdit = async (goodsChannel: API.GoodsChannelType) => {
    await editOrUpdateGoodsChannel(goodsChannel);
    actionRef.current?.reload();
    message.success('设置成功');
    return true;
  };

  const columns = [
    {
      title: '国家',
      dataIndex: 'countryCode',
    },
    {
      title: '渠道代码',
      dataIndex: 'channelCode',
    },
    {
      title: '操作',
      key: 'option',
      render: (_, record: API.GoodsChannelType) => [
        <a
          key="delete"
          onClick={async (e) => {
            e.preventDefault();
            const resp = await deleteGoodsChannel(record);
            if (resp.code === 200) {
              message.success('删除成功');
              actionRef.current?.reloadAndRest?.();
            } else {
              message.error(resp.message);
            }
          }}
        >
          移除
        </a>,
      ],
    },
  ];

  return (
    <ProTable<API.GoodsChannelType>
      request={() => getGoodsChannels(goodsId)}
      rowKey="recId"
      columns={columns}
      search={false}
      actionRef={actionRef}
      toolBarRender={() => {
        return [
          <ModalForm
            title="配置渠道"
            initialValues={{ goodsId: goodsId }}
            key="editOrUpdateGoodsChannel"
            onFinish={async (values: API.GoodsChannelType) => {
              await handleUpdateOrEdit(values);
              actionRef.current?.reloadAndRest?.();
              return true;
            }}
            width={'600px'}
            trigger={<Button type="primary">配置渠道</Button>}
          >
            <ProForm.Group>
              <ProFormText name="goodsId" hidden disabled />
              <Form.Item
                label="国家"
                name="countryCode"
                rules={[{ required: true, message: '请选择国家' }]}
              >
                <Select
                  placeholder="Select a country"
                  style={{ width: 150 }}
                  options={CountryOptions}
                />
              </Form.Item>
              <ProFormText
                name="channelCode"
                width="md"
                label="渠道代码"
                rules={[{ required: true, message: '请填写渠道代码' }]}
              />
            </ProForm.Group>
          </ModalForm>,
        ];
      }}
    />
  );
};

export default GoodsChannelTable;
