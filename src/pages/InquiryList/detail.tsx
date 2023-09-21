import {
  addInquiryItem,
  bindInquiryItem,
  deleteInquiryItem,
  getById,
} from '@/services/apis/inquiry';

import { Link, useParams } from 'umi';

import EllipsisLink from '@/components/EllipsisLink';
import { tagEnumMap } from '@/services/apis/goods';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Descriptions, Divider, Form, Input, message, Modal, Radio, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DetailPage: FC = () => {
  const [current, setCurrent] = useState<Partial<API.InquiryDetail> | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [bindForm] = Form.useForm();

  const params = useParams();

  const loadData = () => {
    getById(params.name).then((x) => setCurrent(x));
  };

  useEffect(() => {
    console.log(params);
    loadData();
  }, []);

  const showModal = (record) => {
    console.log(record);
    bindForm.setFieldsValue({ ...record, relationType: record.relationType || 1 });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      ellipsis: true,
    },
    {
      title: '商品链接',
      dataIndex: 'link',
      render(text, record) {
        return <EllipsisLink length={40} text={text} link={record.link} target={'_blank'} />;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (_, row) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: `${row.remark.replaceAll('\n', '</br>')}`,
            }}
          ></div>
        );
      },
    },
    {
      title: '关联供货SN',
      dataIndex: 'goodsSn',
      render(text, record) {
        if (text === '-') {
          return <></>;
        } else {
          return (
            <>
              <Tag color={tagEnumMap[record.relationType].color} key={record.recId}>
                {tagEnumMap[record.relationType].text}
              </Tag>
              <Link to={'/goods/' + text} target={'_blank'}>
                {text}
              </Link>
            </>
          );
        }
      },
    },
    {
      title: 'Actions',
      width: '150px',
      render(text, record) {
        return (
          <>
            <a
              key="edit"
              onClick={(e) => {
                e.preventDefault();
                showModal(record);
              }}
            >
              关联商品
            </a>
            <Divider type="vertical" />
            <a
              key="delete"
              onClick={async (e) => {
                e.preventDefault();
                const resp = await deleteInquiryItem(record);
                if (resp.code === 200) {
                  message.success('移除商品成功');
                  loadData();
                } else {
                  message.error(resp.message);
                }
              }}
            >
              移除
            </a>
          </>
        );
      },
    },
  ];

  const handleBindRelation = async (values) => {
    const resp = await bindInquiryItem(values);
    if (resp.code === 200) {
      message.success('绑定商品成功');
      loadData();
    } else {
      message.error(resp.message);
    }
    setIsModalOpen(false);
  };

  const bindFormSubmit = () => {
    bindForm.submit();
  };

  const handleBindCancel = () => {
    setIsModalOpen(false);
  };

  /*富文本编辑*/
  const [remarkContent, setRemarkContent] = useState('');
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  return (
    <div>
      <PageContainer>
        <Card bordered={false}>
          <Descriptions title={'单号：' + current?.enquiryOrderSn}>
            <Descriptions.Item label="说明">{current?.enquiryOrderName}</Descriptions.Item>
            <Descriptions.Item label="客户信息">{current?.customerInfo}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(current?.gmtCreated * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />

          <ProTable
            headerTitle="商品列表"
            search={false}
            rowKey="recId"
            dataSource={current?.orderGoodsList}
            columns={columns}
            toolBarRender={() => [
              <Button
                key="export"
                disabled={current?.orderGoodsList.length === 0}
                onClick={() => (location.href = '/api/enquiry/export/' + current?.enquiryOrderId)}
              >
                {' '}
                导出表格{' '}
              </Button>,
              <ModalForm<API.InquiryItem>
                key="addProduct"
                initialValues={{ enquiryOrderId: current?.enquiryOrderId }}
                title="添加商品"
                trigger={
                  <Button type="primary">
                    <PlusOutlined />
                    添加商品
                  </Button>
                }
                form={form}
                autoFocusFirstInput
                modalProps={{
                  destroyOnClose: true,
                  // onCancel: () => console.log('run'),
                }}
                submitTimeout={2000}
                onFinish={async (values: API.InquiryItem) => {
                  await addInquiryItem({ ...values, remark: remarkContent });
                  loadData();
                  message.success('提交成功');
                  return true;
                }}
              >
                <ProFormText name="enquiryOrderId" hidden disabled />
                <ProFormText
                  name="goodsName"
                  width="md"
                  label="商品名称"
                  fieldProps={{ maxLength: 1000, showCount: true }}
                  required
                  placeholder="填写客户方的商品名称"
                />
                <ProFormText
                  name="link"
                  label="商品链接"
                  required
                  placeholder="填写客户方的商品链接"
                />
                <ProForm.Item
                  label="备注"
                  name="remark"
                  rules={[{ required: true, message: '请输入记录' }]}
                  style={{ height: 400 }}
                >
                  <ReactQuill
                    style={{ height: 330 }}
                    modules={quillModules}
                    value={remarkContent}
                    onChange={setRemarkContent}
                  />
                </ProForm.Item>
              </ModalForm>,
            ]}
          />
        </Card>
      </PageContainer>

      <Modal title="关联商品" open={isModalOpen} onOk={bindFormSubmit} onCancel={handleBindCancel}>
        <Form form={bindForm} layout="vertical" onFinish={handleBindRelation}>
          <Form.Item name="recId" style={{ display: 'none' }}>
            <Input hidden />
          </Form.Item>
          <Form.Item
            label="标记"
            name="relationType"
            required
            rules={[{ required: true, message: '请选择一种关联标记!' }]}
            tooltip={{ title: '选择一种关联标记', icon: <InfoCircleOutlined /> }}
          >
            <Radio.Group>
              <Radio.Button value={1} defaultChecked={true}>
                RTS
              </Radio.Button>
              <Radio.Button value={2}>Similar</Radio.Button>
              <Radio.Button value={3}>WFP</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="商品SN"
            required
            rules={[{ required: true, message: '请输入有效的商品SN!' }]}
            name="goodsSn"
          >
            <Input placeholder="填写商品库中的商品SN" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DetailPage;
