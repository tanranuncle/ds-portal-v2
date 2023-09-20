import { exportSettleOrderDetailList, settleOrderList } from '@/services/apis/settleOrder';
import { InboxOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Upload, UploadFile, UploadProps } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';

const OrderList: React.FC = () => {
  //导入弹窗
  const [uploadModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>();

  //文件上传
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  //导出结算单明细
  const handleExportSettleOrderDetail = (settleOrderId) => {
    exportSettleOrderDetailList(settleOrderId);
  };

  const props: UploadProps = {
    name: 'file',
    action: '/api/order/orderImport',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('jwt') || '',
    },
    fileList: fileList,
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return true;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        handleModalOpen(false);
        setFileList([]);
        actionRef.current?.reload();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const columns: ProColumns<any>[] = [
    {
      title: '结算单号',
      order: 10,
      dataIndex: 'settleOrderSn',
      render: (dom, entity) => {
        return <span>{dom}</span>;
      },
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      order: 5,
      key: 'gmtCreatedRange',
      dataIndex: 'gmtCreated',
      valueType: 'dateTimeRange',
      render: (_, record) => [moment(record.gmtCreated * 1000).format('YYYY-MM-DD HH:mm:ss')],
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <Button
          key={'skuEditBtn_' + record.settleOrderId}
          size="small"
          type="link"
          onClick={() => handleExportSettleOrderDetail(record.settleOrderId)}
        >
          导出明细
        </Button>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Order, API.PageParams>
        headerTitle={'结算单列表'}
        actionRef={actionRef}
        rowKey="orderId"
        search={{
          labelWidth: 120,
        }}
        request={settleOrderList}
        columns={columns}
      />
      <ModalForm
        open={uploadModalOpen}
        modalProps={{
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        key="inportModal"
        title="导入"
      >
        <Upload.Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Upload.Dragger>
      </ModalForm>
    </PageContainer>
  );
};
export default OrderList;
