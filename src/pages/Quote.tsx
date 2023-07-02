import { Footer } from '@/components';
import GoodsRibbon from '@/pages/GoodsList/component/GoodsRibbon';
import { quote, tagEnumMap } from '@/services/apis/goods';
import { CountryOptions } from '@/services/apis/logistic';
import { Helmet } from '@@/exports';
import ProCard from '@ant-design/pro-card';
import { GridContent, PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
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
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import React from 'react';
import { history, useLocation, useParams } from 'umi';

const { Title, Paragraph, Text, Link } = Typography;

window.addEventListener('hashchange', function (e) {
  console.log('changed');
});

const Quote = () => {
  const [current, setCurrent] = React.useState();
  const [form] = Form.useForm();

  const goodsSn = useParams<{ sn: string }>().sn;
  const location = useLocation();
  console.log(location);
  const getGoodsQuote = async () => {
    const qStr = location.hash.split('#')[1];
    console.log(qStr);
    const res = await quote(goodsSn, qStr);
    setCurrent(res.data);
    const values = {
      country: res.data?.country,
      quantity: res.data?.quantity,
      skuId: res.data?.currentSku.skuId,
      carrierCode: res.data?.result.carrierCode,
    };
    form.setFieldsValue(values);
  };

  React.useEffect(() => {
    getGoodsQuote();
  }, [location]);

  const onFormChanged = () => {
    history.replace({
      pathname: location.pathname,
      hash:
        'country=' +
        form.getFieldValue('country') +
        '&quantity=' +
        form.getFieldValue('quantity') +
        '&skuId=' +
        form.getFieldValue('skuId'),
    });
  };

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });
  return (
    <PageContainer
      title={
        <Space>
          <img style={{ width: '120px', height: '30px' }} alt="logo" src="/logo.png" />
          Zesty Background
        </Space>
      }
      className={containerClassName}
    >
      <Helmet>
        <title>
          {'报价单'}- {goodsSn}
        </title>
      </Helmet>
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <ProCard bordered={true}>
              <GoodsRibbon goodsType={current?.goodsVo.goodsType}>
                <Carousel autoplay>
                  {current?.goodsVo.imageUrls.map((imgUrl) => (
                    <div>
                      <Image style={{ width: '100%' }} key={imgUrl} src={imgUrl} />
                    </div>
                  ))}
                </Carousel>
              </GoodsRibbon>
            </ProCard>
          </Col>
          <Col lg={17} md={24}>
            <ProCard title={<Title level={4}>{current?.goodsVo?.goodsNameEn}</Title>}>
              <Tooltip
                placement="topLeft"
                title={
                  'product:$' +
                  current?.result.baseFee +
                  '\nshipping:$' +
                  current?.result.operationFee +
                  '\nvolWeight:' +
                  current?.result.volWeight +
                  'g' +
                  '\nActWeight:' +
                  current?.result.actWeight +
                  'g'
                }
              >
                <Title level={2}>$ {current?.result.totalFee}</Title>
              </Tooltip>
              <ProDescriptions>
                <ProDescriptions.Item label="Availability">
                  {tagEnumMap[current?.availability]?.desc}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="Processing days">
                  {current?.processingTime}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="Shipping days">
                  {current?.result.time}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="Shipping Company">
                  {current?.result.carrierCompany}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="Shipping line">
                  {current?.result.carrierCode}
                </ProDescriptions.Item>
              </ProDescriptions>
              <Link href={current?.referenceUrl}>Reference link</Link>
              <Divider dashed />
              <Form form={form}>
                <Form.Item name="carrierCode" hidden={true}>
                  <Input />
                </Form.Item>
                <Form.Item label="Country" name="country">
                  <Select
                    placeholder="Select a country"
                    style={{ width: 150 }}
                    options={CountryOptions}
                    onChange={onFormChanged}
                  />
                </Form.Item>
                <Form.Item label="Sku" name="skuId">
                  <Radio.Group onChange={onFormChanged}>
                    {current?.goodsVo?.skuList.map((item: any) => {
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
              </Form>
            </ProCard>
          </Col>
        </Row>
        {current?.goodsVo?.remarkEn ? (
          <>
            <Divider orientation="left">Description</Divider>
            <Row gutter={24}>
              <Col lg={24} md={24}>
                <ProCard bordered={true}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${current?.goodsVo?.remarkEn?.replaceAll('\n', '</br>')}`,
                    }}
                  ></div>
                </ProCard>
              </Col>
            </Row>
          </>
        ) : null}
      </GridContent>
      <Footer />
    </PageContainer>
  );
};

export default Quote;
