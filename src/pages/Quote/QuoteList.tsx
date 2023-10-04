import { tagEnumMap } from '@/services/apis/goods';
import { ProList } from '@ant-design/pro-components';
import { Card, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType = [
  {
    title: 'Country',
    dataIndex: 'country',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Shipping line',
    dataIndex: 'channelCode',
    render: (text: number, row: any) => (
      <Space>
        {text}
        <Tag>{row.channelType === 1 ? 'Normal' : 'Fast'}</Tag>
      </Space>
    ),
  },
  {
    title: 'Shipping days',
    dataIndex: 'shippingTime',
  },
  {
    title: '1pcs',
    dataIndex: 'amount1Pcs',
  },
  {
    title: '2pcs',
    dataIndex: 'amount2Pcs',
  },
  {
    title: '3pcs',
    dataIndex: 'amount3Pcs',
  },
];

const QuoteList = ({ quoteDto }) => {
  const getQuoteDetails = (skuId) => {
    return quoteDto?.quoteList.filter((x) => x.skuId === skuId);
  };

  const goodsImageUrl = quoteDto?.goodsVo?.goodsImage;

  const data = quoteDto?.goodsVo?.skuList.map((item) => ({
    extra: (
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="sku" src={item.skuImage ? item.skuImage : goodsImageUrl} />}
      >
        <Card.Meta description={tagEnumMap[quoteDto?.goodsVo?.availability]?.desc} />
      </Card>
    ),
    content: (
      <Table
        bordered
        columns={[{ title: item.skuNameEn, children: columns }]}
        dataSource={getQuoteDetails(item.skuId)}
        pagination={false}
        size="small"
      ></Table>
    ),
  }));

  return (
    <ProList
      itemLayout="vertical"
      rowKey="id"
      headerTitle={quoteDto?.goodsVo?.goodsNameEn}
      dataSource={data}
      metas={{
        title: {},
        type: {},
        extra: {},
        content: {},
        actions: {},
      }}
    />
  );
};

export default QuoteList;
