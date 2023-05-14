import { addGoods, fallbackImageData, getGoodsList } from '@/services/apis/goods';
import { CopyOutlined, PlusOutlined, TagOutlined, ThunderboltOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProList,
} from '@ant-design/pro-components';
import { Badge, Button, Image, message, Tag, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'umi';

const GoodsList: FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
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
              return (
                <>
                  {contextHolder}
                  <CopyToClipboard
                    text={row.goodsSn}
                    onCopy={() => {
                      messageApi.info('已复制到剪切板');
                    }}
                  >
                    <Tooltip title="复制商品SN">
                      <Button type="link" icon={<CopyOutlined />} />
                    </Tooltip>
                  </CopyToClipboard>
                </>
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
            render: (goodsImage: string, row) => {
              if (row.goodsType === 3) {
                return (
                  <Badge.Ribbon
                    text={
                      <Tooltip title="特货">
                        <TagOutlined />
                      </Tooltip>
                    }
                    color="volcano"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={goodsImage}
                      fallback={fallbackImageData()}
                    />
                  </Badge.Ribbon>
                );
              } else if (row.goodsType === 2) {
                return (
                  <Badge.Ribbon
                    text={
                      <Tooltip title="带电">
                        <ThunderboltOutlined />
                      </Tooltip>
                    }
                    color="gold"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={goodsImage}
                      fallback={fallbackImageData()}
                    />
                  </Badge.Ribbon>
                );
              } else {
                return (
                  <Image width={200} height={200} src={goodsImage} fallback={fallbackImageData()} />
                );
              }
            },
          },
          actions: {
            render: (text, row) => {
              return row.goodsTags?.map((label: string) => (
                <Tag color={label} key={label}>
                  {label}
                </Tag>
              ));
            },
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
            </ModalForm>,
          ],
        }}
      />
    </PageContainer>
  );
};

export default GoodsList;
