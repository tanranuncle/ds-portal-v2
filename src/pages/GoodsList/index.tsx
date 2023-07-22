import {
  addGoods,
  depotEnum,
  fallbackImageData,
  getGoodsList,
  tagEnumMap,
} from '@/services/apis/goods';
import { CopyOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProDescriptions, ProList } from '@ant-design/pro-components';
import { Button, Image, message, Tooltip, Typography } from 'antd';
import { useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'umi';

import GoodsRibbon from '@/pages/GoodsList/component/GoodsRibbon';
import UpdateForm from './component/eum';

const { Paragraph } = Typography;

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
              return (
                <Link to={'/goods/' + row.goodsSn} target="_blank">
                  {goodsSn}
                </Link>
              );
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
            render: (_, row) => {
              return (
                <Paragraph ellipsis={{ rows: 2 }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${row.remark.replaceAll('\n', '</br>')}`,
                    }}
                  ></div>
                </Paragraph>
              );
            },
          },
          extra: {
            dataIndex: 'goodsImage',
            render: (goodsImage: string, row) => {
              return (
                <GoodsRibbon goodsType={row.goodsType}>
                  <Image width={200} height={200} src={goodsImage} fallback={fallbackImageData()} />
                </GoodsRibbon>
              );
            },
          },
          actions: {
            render: (_, row) => {
              // return row.goodsTags?.map((label: string) => (
              //   <Tag color={label} key={label}>
              //     {label}
              //   </Tag>
              // ));
              return (
                <ProDescriptions>
                  <ProDescriptions.Item label="收货仓库" valueEnum={depotEnum}>
                    {row?.depot}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="库存状态" valueEnum={tagEnumMap}>
                    {row?.availability}
                  </ProDescriptions.Item>
                </ProDescriptions>
              );
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
            <UpdateForm
              values={{ goodsType: 1 }}
              onFinish={async (value) => {
                const success = await addGoods(value as API.Goods);
                if (success) {
                  if (actionRef.current) {
                    // setSearchStr(undefined)
                    actionRef.current?.reloadAndRest();
                  }
                  return true;
                }
                return false;
              }}
              trigger={
                <Button type="primary">
                  <PlusOutlined />
                  添加商品
                </Button>
              }
              title="新建商品"
            />,
          ],
        }}
      />
    </PageContainer>
  );
};

export default GoodsList;
