import {
  deleteGoods,
  depotEnum,
  editGoods,
  fallbackImageData,
  getDetail,
  tagEnumMap,
} from '@/services/apis/goods';
import { DeleteOutlined, EditOutlined, EuroCircleOutlined } from '@ant-design/icons';
import { GridContent, PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, Col, Divider, Image, message, Popconfirm, Row, Tag, Tooltip } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'umi';

import GoodsRibbon from '@/pages/GoodsList/component/GoodsRibbon';
import 'react-quill/dist/quill.snow.css';

import GoodsChannelTable from '@/pages/GoodsList/component/goodsChannel';
import CommentTable from './component/commentTable';
import UpdateForm from './component/eum';
import SkuTable from './component/skuTable';

export type tabKeyType = 'skuList' | 'records' | 'channels';

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
  const [tabKey, setTabKey] = useState<tabKeyType>('skuList');

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
    if (tabValue === 'skuList') {
      return <SkuTable loadData={loadData} current={current} />;
    }
    if (tabValue === 'channels') {
      return <GoodsChannelTable goodsId={current.goodsId} />;
    }
    if (tabValue === 'records') {
      return <CommentTable goodsId={current.goodsId} />;
    }
    return null;
  };

  return (
    <PageContainer title={current?.goodsSn}>
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              cover={
                <GoodsRibbon goodsType={current?.goodsType}>
                  <GoodsImgPreview imageList={current?.imageUrls} />
                </GoodsRibbon>
              }
              actions={[
                <UpdateForm
                  values={current}
                  onFinish={async (value) => {
                    const success = await editGoods(value as API.Goods);
                    if (success) {
                      loadData();
                      return true;
                    }
                    return false;
                  }}
                  trigger={<EditOutlined key="edit" />}
                  title="编辑商品"
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
                <Tooltip title="报价">
                  <EuroCircleOutlined
                    key="quote"
                    onClick={() => {
                      window.open('/goodsQuote/' + current?.goodsSn, '_blank');
                    }}
                  />
                </Tooltip>,
              ]}
            >
              <Card.Meta
                title={current?.goodsName}
                description={
                  <>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${current?.remark.replaceAll('\n', '</br>')}`,
                      }}
                      style={{ height: '100px', overflow: 'auto' }}
                    ></div>
                    <Divider dashed />
                    <ProDescriptions column={1}>
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
                { key: 'channels', tab: '运输线路' },
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
    </PageContainer>
  );
};

export default DetailPage;
