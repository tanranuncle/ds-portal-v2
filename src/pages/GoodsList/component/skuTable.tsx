import { addSku, deleteSku, exportSkuList, updateSku } from '@/services/apis/goods';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, Image, message, Popconfirm } from 'antd';
import React, { useState } from 'react';

export type SkuTableParams = {
  loadData: () => void;
  current: Partial<API.Goods> | undefined;
};
const SkuTable: React.FC<SkuTableParams> = ({ loadData, current }) => {
  const [skuModalVisit, setSkuModalVisit] = useState(false);
  const [skuModalTitle, setSkuModalTitle] = useState('');
  const [form] = Form.useForm();

  const handleAddSku = (sku) => {
    setSkuModalTitle('添加sku');
    form.setFieldsValue({ ...sku, goodsId: current?.goodsId });
    setSkuModalVisit(true);
  };

  const handleModifySku = (sku) => {
    setSkuModalTitle('修改sku');
    form.setFieldsValue(sku);
    setSkuModalVisit(true);
  };

  const handleCopySku = (sku) => {
    setSkuModalTitle('复制sku');
    form.setFieldsValue(sku);
    form.setFieldValue('skuId', undefined);
    form.setFieldValue('skuName', undefined);
    form.setFieldValue('skuNameEn', undefined);
    form.setFieldValue('suppSkuId', undefined);
    setSkuModalVisit(true);
  };

  const handleDeleteSku = async (skuId) => {
    await deleteSku(skuId);
    loadData();
    message.success('删除成功');
    return true;
  };

  const handleSkuSubmit = async (values: API.Sku) => {
    console.log(values);
    if (values.skuId) {
      await updateSku(values);
    } else {
      await addSku(values);
    }
    loadData();
    message.success('提交成功');
    setSkuModalVisit(false);
    return true;
  };

  const skuColumns: ProColumns<API.Sku>[] = [
    {
      title: 'skuId',
      dataIndex: 'skuId',
      width: 78,
    },
    {
      title: 'sku名称',
      dataIndex: 'skuName',
    },
    {
      title: '图片',
      dataIndex: 'skuImage',
      render: (text, row) => {
        if (row.skuImage.startsWith('http')) {
          return <Image width={48} src={row.skuImage} />;
        } else {
          return <div></div>;
        }
      },
    },
    {
      title: '店小蜜sku',
      dataIndex: 'dxmSkuId',
    },
    {
      title: '供方skuId',
      dataIndex: 'suppSkuId',
    },
    {
      title: '供应商信息',
      dataIndex: 'suppName',
      render: (text, row) => {
        if (row.link.startsWith('http')) {
          return (
            <a href={row.link} target="_blank" title={row.link}>
              {text}
            </a>
          );
        } else {
          return (
            <a title={row.link} onClick={() => message.error('无效链接，请以http开头')}>
              {text}
            </a>
          );
        }
      },
    },
    {
      title: '计费体积(长*宽*高)',
      render: (_, row) => {
        return (
          <>
            {row.length * row.width * row.height}cm³({row.length}*{row.width}*{row.height})
          </>
        );
      },
      search: false,
    },
    {
      title: '计费重量(kg)',
      dataIndex: 'weight',
      render: (text) => {
        return text + ' kg';
      },
    },
    {
      title: '采购价(元)',
      dataIndex: 'purPrice',
      search: false,
      render: (text) => {
        return text + ' RMB';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <Button
          key={'skuEditBtn' + record.skuId}
          size="small"
          type="link"
          onClick={() => handleModifySku(record)}
        >
          编辑
        </Button>,
        <Button
          key={'skuCopyBtn' + record.skuId}
          size="small"
          type="link"
          onClick={() => handleCopySku(record)}
        >
          复制
        </Button>,
        <Popconfirm
          key={'skuDelPop' + record.skuId}
          title="删除后不能恢复"
          onConfirm={() => handleDeleteSku(record.skuId)}
        >
          <Button key={'skuDelBtn' + record.skuId} size="small" danger type="link">
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        columns={skuColumns}
        rowKey="skuId"
        search={false}
        dataSource={current?.skuList}
        toolBarRender={() => [
          <Button type="primary" onClick={handleAddSku}>
            <PlusOutlined />
            添加sku
          </Button>,
          <Button
            key="exportBtn"
            type="primary"
            onClick={() => {
              exportSkuList(current?.goodsId);
            }}
          >
            导出
          </Button>,
        ]}
      />
      <ModalForm<API.Sku>
        initialValues={{ goodsId: current?.goodsId }}
        key="addSKu"
        title={skuModalTitle}
        open={skuModalVisit}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setSkuModalVisit(false),
        }}
        submitTimeout={2000}
        onFinish={handleSkuSubmit}
        layout="horizontal"
      >
        <ProFormText name="goodsId" hidden disabled />
        <ProFormText name="skuId" hidden disabled />
        <ProForm.Group>
          <ProFormText
            width={130}
            name="skuName"
            label="sku名称"
            required
            placeholder="填写sku名称"
            rules={[{ required: true, message: 'sku名称为必填项' }]}
          />
          <ProFormText
            width={130}
            name="skuNameEn"
            label="sku名称(EN)"
            placeholder="填写sku名称(EN)"
            rules={[{ required: false, message: 'sku名称(EN)为非必填项' }]}
          />
          <ProFormText name="parentId" width={130} label="父skuId" placeholder="父skuId" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            label="采购价"
            name="purPrice"
            required
            width="xs"
            min={1.0}
            fieldProps={{ precision: 2 }}
            rules={[{ required: true, message: '采购价为必填项' }]}
          />
          <ProFormText name="suppSkuId" width={130} label="供方skuId" placeholder="供方skuId" />
          <ProFormText name="dxmSkuId" width={130} label="店小蜜sku" placeholder="店小蜜sku" />
        </ProForm.Group>
        <ProFormText
          name="suppName"
          label="供应商信息"
          required
          placeholder="填写供应商信息"
          rules={[{ required: true, message: '供应商信息为必填项' }]}
        />
        <ProFormText
          name="link"
          label="sku链接"
          required
          placeholder="填写sku链接"
          rules={[{ required: true, message: 'sku链接为必填项' }]}
        />
        <ProFormText
          name="skuImage"
          label="图片"
          required={false}
          placeholder="填写sku图片"
          rules={[{ required: false, message: 'sku图片为必填项' }]}
        />
        <ProForm.Group>
          <ProFormDigit
            label="长"
            name="length"
            width="xs"
            min={1}
            placeholder="cm"
            rules={[{ required: true, message: '必填项' }]}
          />
          <ProFormDigit
            label="宽"
            name="width"
            width="xs"
            min={1}
            placeholder="cm"
            rules={[{ required: true, message: '必填项' }]}
          />
          <ProFormDigit
            label="高"
            name="height"
            width="xs"
            min={1}
            placeholder="cm"
            rules={[{ required: true, message: '必填项' }]}
          />
          <ProFormDigit
            label="重量"
            name="weight"
            width="xs"
            min={0.01}
            placeholder="kg"
            rules={[{ required: true, message: '必填项' }]}
          />
        </ProForm.Group>
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>
    </>
  );
};

export default SkuTable;
