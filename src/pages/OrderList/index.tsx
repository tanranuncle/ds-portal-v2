import { orderList } from '@/services/apis/order';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
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

  const props: UploadProps = {
    name: 'file',
    action: '/api/order/orderImport',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('jwt') || '',
    },
    fileList: fileList,
    beforeUpload: (file) => {
      setFileList([file]);
      return true;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'removed') {
        setFileList([]);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        handleModalOpen(false);
        setFileList([]);
        actionRef.current?.reload();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.` + info.file.response.message);
      }
    },
  };

  const columns: ProColumns<API.Order>[] = [
    {
      title: '订单号',
      order: 10,
      dataIndex: 'orderSn',
      render: (dom, entity) => {
        return <span>{dom}</span>;
      },
    },
    {
      title: '物流单号',
      order: 8,
      dataIndex: 'trackingNumber',
      render: (dom, entity) => {
        return (
          <div>
            <div>单号1:{entity.trackingNumber}</div>
            <div>单号2:{entity.trackingNumber2}</div>
          </div>
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      hideInSearch: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      hideInSearch: true,
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      hideInSearch: true,
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      hideInSearch: true,
      render: (_, record) => [moment(record.orderTime * 1000).format('YYYY-MM-DD')],
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      hideInSearch: true,
      render: (_, record) => [moment(record.payTime * 1000).format('YYYY-MM-DD')],
    },
    {
      title: '发货时间',
      dataIndex: 'shippingTime',
      hideInSearch: true,
      render: (_, record) => [moment(record.shippingTime * 1000).format('YYYY-MM-DD')],
    },
    {
      title: '发货方式',
      dataIndex: 'shippingMethod',
      hideInSearch: true,
    },
    {
      title: '收货信息',
      dataIndex: 'shippingName',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div>
            <div>姓名:{entity.shippingName}</div>
            <div>电话:{entity.phoneNumber}</div>
            <div>
              国家:{entity.country}({entity.countryCode})
            </div>
            <div>省:{entity.province}</div>
            <div>市:{entity.city}</div>
            <div>地址:{entity.address}</div>
            <div>邮编:{entity.zipCode}</div>
          </div>
        );
      },
    },
    {
      title: '创建时间',
      order: 5,
      key: 'gmtCreatedRange',
      dataIndex: 'gmtCreated',
      valueType: 'dateTimeRange',
      render: (_, record) => [moment(record.gmtCreated * 1000).format('YYYY-MM-DD HH:mm:ss')],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Order, API.PageParams>
        headerTitle={'订单列表'}
        actionRef={actionRef}
        rowKey="orderId"
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
            <UploadOutlined /> 导入订单
          </Button>,
        ]}
        request={orderList}
        columns={columns}
        scroll={{ x: 2000 }}
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
