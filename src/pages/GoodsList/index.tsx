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
import { Button, Image, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
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
  const [searchStr, setSearchStr] = useState();
  return (
    <PageContainer>
      <ProList<any>
        rowKey="goodsSn"
        request={(params) => {
          return getGoodsList({ ...params, q: searchStr });
        }}
        itemLayout="vertical"
        actionRef={actionRef}
        pagination={{
          pageSize: 5,
        }}
        metas={{
          title: {
            dataIndex: 'goodsSn',
            render: (goodsSn, row) => {
              return <Link to={'/goods/' + row.goodsSn}>{goodsSn}</Link>;
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
            dataIndex: 'goodsImage',
            render: (goodsImage: string) => (
              <Image
                width={200}
                height={200}
                src={goodsImage}
                fallback="data:image/png;base64,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"
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
              setSearchStr(value);
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
                    // setSearchStr(undefined)
                    actionRef.current.reloadAndRest();
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
                name="goodsImage"
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
