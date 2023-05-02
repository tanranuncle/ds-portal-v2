import { addGoods, getGoodsList } from '@/services/apis/goods';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProList,
} from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef } from 'react';
import { Link } from 'umi';

// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;

// const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
//   <Space>
//     {React.createElement(icon)}
//     {text}
//   </Space>
// );

// const extraContent = (
//   <div>
//     <RadioGroup defaultValue="all">
//       <RadioButton value="all">
//         <IconText icon={AppstoreOutlined} text="全部" key="list-vertical-like-o" />
//       </RadioButton>
//       <RadioButton value="progress">
//         <IconText icon={ThunderboltOutlined} text="带电" key="list-vertical-star-o" />
//       </RadioButton>
//       <RadioButton value="waiting">
//         <IconText icon={TagOutlined} text="特货" key="list-vertical-message" />
//       </RadioButton>
//     </RadioGroup>
//   </div>
// );

const GoodsList: FC = () => {
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer>
      <ProList<any>
        rowKey="goodsSn"
        request={getGoodsList}
        itemLayout="vertical"
        actionRef={actionRef}
        pagination={{
          pageSize: 5,
        }}
        metas={{
          title: {
            dataIndex: 'goodsSn',
            render: (goodsSn, row) => {
              return <Link to={'/goods/' + row.goodsId}>{goodsSn}</Link>;
            },
          },
          subTitle: {
            render: (_, row) => {
              console.log(row);
              const labels = [
                { name: 'red', color: 'red' },
                { name: 'blue', color: 'blue' },
              ];
              return (
                <Space size={0}>
                  {labels?.map((label: { name: string }) => (
                    <Tag color={label.color} key={label.name}>
                      {label.name}
                    </Tag>
                  ))}
                </Space>
              );
            },
          },
          description: {
            dataIndex: 'goodsName',
          },
          content: {
            dataIndex: 'remark',
          },
          extra: {
            dataIndex: 'imageUrl',
            render: (imageUrl) => (
              <img
                width={200}
                height={200}
                alt={imageUrl}
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            ),
          },
          actions: {
            render: (text, row) => [
              <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="link">
                编辑
              </a>,
              <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="view">
                删除
              </a>,
            ],
          },
        }}
        toolbar={{
          title: '商品列表',
          search: {
            onSearch: (value: string) => {
              console.log(value);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            },
          },
          actions: [
            <ModalForm
              title={'新建商品'}
              key="addProduct"
              width="600px"
              trigger={
                <Button type="primary">
                  <PlusOutlined />
                  添加商品
                </Button>
              }
              onFinish={async (value) => {
                const success = await addGoods(value as API.Goods);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
                return true;
              }}
            >
              <ProFormText
                rules={[{ required: true, message: '商品编号为必填项' }]}
                width="md"
                name="goodsSn"
                label="商品编号"
              />
              <ProFormText
                rules={[{ required: true, message: '商品名称为必填项' }]}
                width="md"
                name="goodsName"
                label="商品名称"
              />
              <ProFormText
                rules={[{ required: true, message: '请填入商品图片链接' }]}
                name="imageUrl"
                label="商品图片链接"
                placeholder="http://"
              />
              <ProFormTextArea name="remark" label="商品描述" />
            </ModalForm>,
          ],
        }}
      />
    </PageContainer>
  );
};

export default GoodsList;
