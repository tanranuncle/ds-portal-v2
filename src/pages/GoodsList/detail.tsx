import {
  deleteGoods,
  depotEnum,
  editGoods,
  fallbackImageData,
  getDetail,
  tagEnumMap,
} from '@/services/apis/goods';
import { DeleteOutlined, EditOutlined, EuroCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Empty, Image, message, Popconfirm, Tag } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'umi';

import GoodsRibbon from '@/pages/GoodsList/component/GoodsRibbon';
import 'react-quill/dist/quill.snow.css';

import GoodsChannelTable from '@/pages/GoodsList/component/goodsChannel';
import QuoteTimeline from '@/pages/GoodsList/component/quoteTimeline';
import CommentTable from './component/commentTable';
import UpdateForm from './component/eum';
import SkuTable from './component/skuTable';

export type tabKeyType = 'detail' | 'skuList' | 'records' | 'channels';

const GoodsImgPreview: React.FC<{ imageList: string[] | undefined; width?: string | number }> = ({
  imageList,
  width,
}) => {
  const [visible, setVisible] = useState(false);
  if (!imageList) {
    return <></>;
  } else {
    return (
      <>
        <Image
          width={width ? width : '100%'}
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
  const [tabKey, setTabKey] = useState<tabKeyType>('detail');

  const params = useParams();

  const loadData = () => {
    getDetail(params.sn).then((x) => setCurrent(x));
  };

  useEffect(() => {
    console.log(params);
    loadData();
  }, []);

  // 渲染tab切换
  const renderChildrenByTabKey = (tabValue: tabKeyType) => {
    if (tabValue === 'detail') {
      return (
        <Card>
          <div
            dangerouslySetInnerHTML={{
              __html: `${current?.remark.replaceAll('\n', '</br>')}`,
            }}
          ></div>
        </Card>
      );
    }
    if (tabValue === 'skuList') {
      return <SkuTable loadData={loadData} current={current} />;
    }
    if (tabValue === 'channels') {
      return <GoodsChannelTable goodsId={current?.goodsId} />;
    }
    if (tabValue === 'records') {
      return <CommentTable goodsId={current?.goodsId} />;
    }
    if (tabValue === 'quote') {
      return (
        <Card>
          <QuoteTimeline goodsId={current?.goodsId} goodsSn={current?.goodsSn} />
        </Card>
      );
    }
    return null;
  };

  if (current?.status === 3) {
    return <Empty description={'商品[' + params.sn + ']已删除'}></Empty>;
  }

  return (
    <PageContainer
      title={current?.goodsSn}
      extra={[
        <Button
          type="primary"
          icon={<EuroCircleOutlined />}
          key="quote"
          onClick={() => {
            window.open('/goodsQuote/' + current?.goodsSn, '_blank');
          }}
        >
          报价
        </Button>,
        <UpdateForm
          key="edit"
          values={current}
          onFinish={async (value) => {
            const success = await editGoods(value as API.Goods);
            if (success) {
              loadData();
              return true;
            }
            return false;
          }}
          trigger={<Button icon={<EditOutlined />}>编辑</Button>}
          title="编辑商品"
        />,
        <Popconfirm
          title="删除商品"
          description="确认要删除这个商品吗?"
          onConfirm={async () => {
            const success = await deleteGoods({ goodsId: current?.goodsId } as API.Goods);
            if (success) {
              message.success('删除成功');
              //window.history.back();
              loadData();
            }
            return true;
          }}
          okText="确认"
          cancelText="取消"
          key="delete"
        >
          <Button icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ]}
      content={
        <>
          <ProDescriptions column={1}>
            <ProDescriptions.Item label="商品名称">{current?.goodsName}</ProDescriptions.Item>
            <ProDescriptions.Item label="收货仓库" valueEnum={depotEnum}>
              {current?.depot}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="库存状态" valueEnum={tagEnumMap}>
              {current?.availability}
            </ProDescriptions.Item>
          </ProDescriptions>
          {current?.goodsTags?.map((x) => (
            <Tag key={current?.goodsId + '_' + x} color={x}>
              {x}
            </Tag>
          ))}
          {/* <TagList tags={[{ key: 'red', label: 'red' }]} /> */}
          {/*<Divider dashed />*/}
        </>
      }
      extraContent={
        <div style={{ width: '200px' }}>
          <GoodsRibbon goodsType={current?.goodsType}>
            <GoodsImgPreview imageList={current?.imageUrls} />
          </GoodsRibbon>
        </div>
      }
      tabList={[
        { key: 'detail', tab: '详情' },
        { key: 'skuList', tab: 'sku列表 ' },
        { key: 'channels', tab: '运输线路' },
        { key: 'quote', tab: '报价历史' },
        { key: 'records', tab: '记录' },
      ]}
      tabActiveKey={tabKey}
      onTabChange={(_tabKey: string) => {
        setTabKey(_tabKey as tabKeyType);
      }}
    >
      {renderChildrenByTabKey(tabKey)}
    </PageContainer>
  );
};

export default DetailPage;
