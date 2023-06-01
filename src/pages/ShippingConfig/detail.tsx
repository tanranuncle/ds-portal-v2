import { getShippingConfig, ShippingConfigType } from '@/services/apis/logistic';
import { InboxOutlined } from '@ant-design/icons';
import { ModalForm, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { useState } from 'react';

import { useParams } from 'umi';
import template from './resources/template.xlsx';
export default () => {
  const [current, setCurrent] = useState<readonly ShippingConfigType[]>([]);

  const { channelId } = useParams();

  const columns: ProColumns<ShippingConfigType>[] = [
    {
      title: '国家/地区',
      dataIndex: 'country',
      tooltip: '国家/地区',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      // 第一行不允许编辑
      editable: false,
      onCell: (row) => {
        console.log(row);
        return { rowSpan: row.rowSpan };
      },
      width: '15%',
    },
    {
      title: '记抛比',
      dataIndex: 'volWeightRate',
      tooltip: '只读，使用form.getFieldValue可以获取到值',
      readonly: true,
      width: '15%',
      onCell: (row, index) => {
        console.log(index);
        return { rowSpan: row.rowSpan };
      },
    },
    {
      title: '参考时效',
      dataIndex: 'shippingTime',
      tooltip: '只读，使用form.getFieldValue可以获取到值',
      readonly: true,
      width: '15%',
      onCell: (row, index) => {
        console.log(index);
        return { rowSpan: row.rowSpan };
      },
    },
    {
      title: '重量左值(>)',
      key: 'state',
      dataIndex: 'left',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '重量右值(<=)',
      dataIndex: 'right',
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
      title: '运费(RMB/KG)',
      dataIndex: 'shippingFee',
      valueType: 'digit',
    },
    {
      title: '挂号费(RMB/票)',
      dataIndex: 'extraFee',
      valueType: 'digit',
    },
  ];

  const props: UploadProps = {
    name: 'file',
    action: '/api/config/upload',
    headers: {
      authorization: 'bearer ' + localStorage.getItem('jwt') || '',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
      <ProTable<ShippingConfigType>
        rowKey="id"
        size="small"
        headerTitle={
          <>
            云途全球专线挂号（特惠带电）<div>运输代码:THZXR</div>
          </>
        }
        search={false}
        scroll={{
          x: 960,
        }}
        loading={false}
        toolBarRender={() => [
          <ModalForm key="inportModal" title="导入" trigger={<Button> 导入 </Button>}>
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                运费配置导入将覆盖原有数据，请取保配置数据的完整性！
              </p>
              <a href={template} download={'template.xlsx'}>
                下载导入模版
              </a>
            </Upload.Dragger>
          </ModalForm>,
          <Button key="exportBtn" type="primary">
            导出
          </Button>,
        ]}
        columns={columns}
        request={(params) => getShippingConfig({ channelId: channelId, ...params })}
      />
    </PageContainer>
  );
};
