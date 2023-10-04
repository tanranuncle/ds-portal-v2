import GoodsRibbon from '@/pages/GoodsList/component/GoodsRibbon';
import { tagEnumMap } from '@/services/apis/goods';
import ProCard from '@ant-design/pro-card';
import { GridContent, ProDescriptions, ProFormSelect } from '@ant-design/pro-components';
import {
  Carousel,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Row,
  Tooltip,
  Typography,
} from 'antd';

const { Title, Paragraph, Text, Link } = Typography;
const QuoteGrid = ({ quoteDto, countries, selected, result, form, onFormChanged }) => {
  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <ProCard bordered={true}>
            <GoodsRibbon goodsType={quoteDto?.goodsVo.goodsType}>
              <Carousel autoplay>
                {quoteDto?.goodsVo.imageUrls.map((imgUrl) => (
                  <Image style={{ width: '100%' }} key={imgUrl} src={imgUrl} />
                ))}
              </Carousel>
            </GoodsRibbon>
          </ProCard>
        </Col>
        <Col lg={17} md={24}>
          <ProCard title={<Title level={4}>{quoteDto?.goodsVo?.goodsNameEn}</Title>}>
            <Tooltip
              placement="topLeft"
              // title={
              //   'product:$' +
              //   current?.result.baseFee +
              //   '\nshipping:$' +
              //   current?.result.operationFee +
              //   '\nvolWeight:' +
              //   current?.result.volWeight +
              //   'g' +
              //   '\nActWeight:' +
              //   current?.result.actWeight +
              //   'g'
              // }
            >
              <Title level={2}>$ {result?.amount}</Title>
            </Tooltip>
            <ProDescriptions>
              <ProDescriptions.Item label="Availability">
                {tagEnumMap[quoteDto?.availability]?.desc}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Processing days">
                {quoteDto?.processingTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Shipping days">
                {result?.shippingTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Shipping Company">
                {result?.carrierCompany}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Shipping line">
                {result?.channelCode}
              </ProDescriptions.Item>
            </ProDescriptions>
            <Link href={quoteDto?.referenceUrl}>Reference link</Link>
            <Divider dashed />
            <Form form={form} initialValues={selected}>
              <Form.Item name="carrierCode" hidden={true}>
                <Input />
              </Form.Item>
              <ProFormSelect
                name="country"
                label="Country"
                options={countries}
                style={{ width: 150 }}
                placeholder="Please select a country"
                rules={[{ required: true, message: 'Please select your country!' }]}
                onChange={onFormChanged}
              />

              <Form.Item label="Sku" name="skuId">
                <Radio.Group onChange={onFormChanged}>
                  {quoteDto?.goodsVo?.skuList.map((item: any) => {
                    return (
                      <Radio.Button key={item.skuId} value={item.skuId}>
                        {item.skuNameEn}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
              <Form.Item label="QTY" name="quantity">
                <InputNumber
                  min={1}
                  max={3}
                  style={{ width: '100px' }}
                  addonAfter="pcs"
                  title={'qty'}
                  onChange={onFormChanged}
                ></InputNumber>
              </Form.Item>
              <Form.Item label="ChannelType" name="channelType">
                <Radio.Group onChange={onFormChanged}>
                  <Radio.Button key="N" value={1}>
                    {' '}
                    Normal{' '}
                  </Radio.Button>
                  <Radio.Button key="F" value={2}>
                    {' '}
                    Fast{' '}
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Form>
          </ProCard>
        </Col>
      </Row>
      {quoteDto?.goodsVo?.remarkEn ? (
        <>
          <Divider orientation="left">Description</Divider>
          <Row gutter={24}>
            <Col lg={24} md={24}>
              <ProCard bordered={true}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: `${quoteDto?.goodsVo?.remarkEn?.replaceAll('\n', '</br>')}`,
                  }}
                ></div>
              </ProCard>
            </Col>
          </Row>
        </>
      ) : null}
    </GridContent>
  );
};

export default QuoteGrid;
