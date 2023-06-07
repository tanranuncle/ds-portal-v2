import { addInquiry, inquiryList, removeInquiry } from '@/services/apis/inquiry';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Badge, Button, message } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { Link } from 'umi';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.Inquiry) => {
  const hide = message.loading('正在添加');
  try {
    await addInquiry({
      ...fields,
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.Inquiry[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeInquiry({
      ids: selectedRows.map((row) => row.enquiryOrderId),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const InquiryList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.Inquiry[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.Inquiry>[] = [
    {
      title: '询价单号',
      order: 10,
      dataIndex: 'enquiryOrderSn',
      tip: 'The enquiry Order Sn is the unique key',
      render: (dom, entity) => {
        return (
          <Badge size="small" offset={[10, 0]} count={entity.unRelationGoodsNum}>
            <Link to={'/inquiries/' + entity.enquiryOrderId}>{dom}</Link>
          </Badge>
        );
      },
    },
    {
      title: '说明',
      dataIndex: 'enquiryOrderName',
      valueType: 'textarea',
    },
    {
      title: '客户信息',
      dataIndex: 'customerInfo',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '创建时间',
      order: 9,
      key: 'gmtCreatedRange',
      dataIndex: 'gmtCreated',
      valueType: 'dateTimeRange',
      render: (_, record) => [moment(record.gmtCreated * 1000).format('YYYY-MM-DD HH:mm:ss')],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Inquiry, API.PageParams>
        headerTitle={'询价单列表'}
        actionRef={actionRef}
        rowKey="enquiryOrderId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={inquiryList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={'新建询价单'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.Inquiry);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '询价单名称',
            },
          ]}
          width="md"
          name="enquiryOrderName"
          label="询价单名称"
        />
        <ProFormTextArea width="md" name="customerInfo" label="客户信息" />
      </ModalForm>
    </PageContainer>
  );
};
export default InquiryList;
