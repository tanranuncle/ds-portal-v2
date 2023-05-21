import {
  addComment,
  addSku,
  deleteGoods,
  deleteSku,
  editGoods,
  fallbackImageData,
  getComment,
  getDetail,
  updateSku,
} from '@/services/apis/goods';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  GridContent,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProList,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Col, Divider, Form, Image, message, Popconfirm, Row, Tag } from 'antd';
import moment from 'moment';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';

export type tabKeyType = 'skuList' | 'records';

const GoodsImgPreview: React.FC<{ imageList: string[] }> = ({ imageList }) => {
  const [visible, setVisible] = useState(false);
  if (!imageList) {
    return <></>;
  } else {
    return (
      <>
        <Image
          preview={{ visible: false }}
          src={imageList[0]}
          fallback={fallbackImageData()}
          onClick={() => setVisible(true)}
        />
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
            {imageList.map((imgUrl) => (
              <Image key={imgUrl} src={imgUrl} />
            ))}
          </Image.PreviewGroup>
        </div>
      </>
    );
  }
};

const DetailPage: FC = () => {
  const [current, setCurrent] = useState<Partial<API.Goods> | undefined>(undefined);
  const [skuModalVisit, setSkuModalVisit] = useState(false);
  const [tabKey, setTabKey] = useState<tabKeyType>('skuList');
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const [editProductModalOpen, handleEditProductModalOpen] = useState<boolean>(false);
  const [bindEditProductForm] = Form.useForm();

  const params = useParams();

  const loadData = () => {
    getDetail(params.sn).then((x) => setCurrent(x));
  };

  useEffect(() => {
    console.log(params);
    loadData();
  }, []);

  const showEditProductModal = (current) => {
    bindEditProductForm.resetFields();
    current.goodsType = String(current.goodsType);
    bindEditProductForm.setFieldsValue({ ...current });
    handleEditProductModalOpen(true);
  };

  const handleDeleteSku = async (skuId) => {
    await deleteSku(skuId);
    loadData();
    message.success('删除成功');
    return true;
  };

  const handleModifySku = (sku) => {
    form.setFieldsValue(sku);
    setSkuModalVisit(true);
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
      width: 48,
    },
    {
      title: 'sku名称',
      dataIndex: 'skuName',
    },
    {
      title: '供方skuId',
      dataIndex: 'suppSkuId',
    },
    {
      title: '供应商信息',
      dataIndex: 'suppName',
    },
    {
      title: '体积(长*宽*高)',
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
      title: '重量(kg)',
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

  // 渲染tab切换
  const renderChildrenByTabKey = (tabValue: tabKeyType) => {
    if (tabValue === 'skuList') {
      return (
        <ProTable
          columns={skuColumns}
          search={false}
          dataSource={current?.skuList}
          toolBarRender={() => [
            <ModalForm<API.Sku>
              initialValues={{ goodsId: current?.goodsId }}
              key="addSKu"
              title="添加sku"
              open={skuModalVisit}
              trigger={
                <Button type="primary">
                  <PlusOutlined />
                  添加sku
                </Button>
              }
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
                  name="skuName"
                  label="sku名称"
                  required
                  placeholder="填写sku名称"
                  rules={[{ required: true, message: 'sku名称为必填项' }]}
                />
                <ProFormText name="suppSkuId" label="供方skuId" placeholder="供方skuId" />
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
            </ModalForm>,
          ]}
        />
      );
    }
    if (tabValue === 'records') {
      return (
        <>
          <ProList<{ title: string }>
            request={() => getComment(current?.goodsId)}
            actionRef={actionRef}
            metas={{
              title: { dataIndex: 'user' },
              description: { dataIndex: 'content' },
              avatar: { dataIndex: 'avatar' },
              actions: {
                render: (_, row) => {
                  return [
                    <span key="fakeTime">
                      {moment(row.createdAt * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    </span>,
                  ];
                },
              },
            }}
            toolBarRender={() => {
              return [
                <ModalForm
                  initialValues={{ goodsId: current?.goodsId }}
                  key="addComment"
                  onFinish={async (values) => {
                    await addComment(values);
                    actionRef.current?.reloadAndRest?.();
                    message.success('提交成功');
                    return true;
                  }}
                  trigger={
                    <Button type="primary">
                      {' '}
                      <PlusOutlined /> 记录{' '}
                    </Button>
                  }
                >
                  <ProFormText name="goodsId" hidden disabled />
                  <ProFormTextArea name="content" label="记录" />
                </ModalForm>,
              ];
            }}
          />
        </>
      );
    }
    return null;
  };

  return (
    <PageContainer title={current?.goodsSn}>
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              cover={<GoodsImgPreview imageList={current?.imageUrls} />}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    showEditProductModal(current);
                  }}
                />,
                <Popconfirm
                  title="删除商品"
                  description="确认要删除这个商品吗?"
                  onConfirm={async () => {
                    const success = await deleteGoods({ goodsId: current?.goodsId } as API.Goods);
                    if (success) {
                      message.success('删除成功');
                      window.history.back();
                      // loadData();
                    }
                    return true;
                  }}
                  okText="确认"
                  cancelText="取消"
                  key="delete"
                >
                  <DeleteOutlined />
                </Popconfirm>,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Card.Meta
                title={current?.goodsName}
                description={
                  <>
                    {current?.remark}
                    <Divider dashed />
                    <ProDescriptions>
                      <ProDescriptions.Item
                        label="收货仓库"
                        valueEnum={{
                          yw: { text: '义务仓库' },
                          gz: { text: '广州仓库' },
                        }}
                      >
                        {current?.depot}
                      </ProDescriptions.Item>
                    </ProDescriptions>
                    {current?.goodsTags?.map((x) => (
                      <Tag key={current?.goodsId + '_' + x} color={x}>
                        {x}
                      </Tag>
                    ))}
                    {/* <TagList tags={[{ key: 'red', label: 'red' }]} /> */}
                  </>
                }
              />
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              bordered={false}
              tabList={[
                { key: 'skuList', tab: 'sku列表 ' },
                { key: 'records', tab: '记录' },
              ]}
              activeTabKey={tabKey}
              onTabChange={(_tabKey: string) => {
                setTabKey(_tabKey as tabKeyType);
              }}
            >
              {renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>

      <ModalForm
        title={'编辑商品'}
        key="editProduct"
        width="600px"
        open={editProductModalOpen}
        onOpenChange={handleEditProductModalOpen}
        form={bindEditProductForm}
        onFinish={async (value) => {
          const success = await editGoods(value as API.Goods);
          if (success) {
            handleEditProductModalOpen(false);
            loadData();
          }
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              message: '商品ID',
              required: true,
            },
          ]}
          hidden={true}
          width="md"
          name="goodsId"
          label="商品ID"
        />
        <ProFormText
          rules={[{ required: true, message: '商品名称为必填项' }]}
          width="md"
          name="goodsName"
          label="商品名称"
        />
        <ProFormRadio.Group
          name="goodsType"
          label="商品类型"
          initialValue={'1'}
          options={[
            { label: '普通', value: '1' },
            { label: '带电', value: '2' },
            { label: '特货', value: '3' },
          ]}
        />
        <ProFormText
          rules={[{ required: true, message: '请填入商品图片链接' }]}
          name="goodsImage"
          label="商品图片链接"
          placeholder="http://"
        />
        <ProFormTextArea name="remark" label="商品描述" />
      </ModalForm>
    </PageContainer>
  );
};

export default DetailPage;
