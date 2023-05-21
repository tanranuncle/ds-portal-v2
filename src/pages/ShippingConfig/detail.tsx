import { DataSourceType, getShippingConfig } from '@/services/apis/config';
import { UploadOutlined } from '@ant-design/icons';
import {
  EditableProTable,
  ModalForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormField,
} from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  // const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
  //   'bottom',
  // );

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '国家/地区',
      dataIndex: 'country',
      tooltip: '只读，使用form.getFieldValue获取不到值',
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
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        // <a
        //   key="delete"
        //   onClick={() => {
        //     setDataSource(dataSource.filter((item) => item.id !== record.id));
        //   }}
        // >
        //   删除
        // </a>,
      ],
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
      <EditableProTable<DataSourceType>
        rowKey="id"
        size="small"
        headerTitle={
          <>
            云途全球专线挂号（特惠带电）<div>运输代码:THZXR</div>
          </>
        }
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={false}
        loading={false}
        toolBarRender={() => [
          <ModalForm key="inportModal" title="导入" trigger={<Button> 导入 </Button>}>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <a href="#">下载导入模版</a>
          </ModalForm>,
          <Button key="exportBtn" type="primary">
            {' '}
            导出{' '}
          </Button>,
        ]}
        columns={columns}
        request={getShippingConfig}
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
    </PageContainer>
  );
};
