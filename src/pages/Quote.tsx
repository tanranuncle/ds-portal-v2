import { Footer } from '@/components';
import { quote } from '@/services/apis/goods';
import { CountryOptions } from '@/services/apis/logistic';
import { Helmet } from '@@/exports';
import ProCard from '@ant-design/pro-card';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Divider, Form, InputNumber, Radio, Select, Space, Tooltip, Typography } from 'antd';
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
    <PageContainer className={containerClassName}>
      <Helmet>
        <title>
          {'报价单'}- {goodsSn}
        </title>
      </Helmet>
      <ProCard
        title={
          <Space>
            <img style={{ width: '120px', height: '30px' }} alt="logo" src="/logo.png" />
            Zesty Background
          </Space>
        }
        split={'vertical'}
        bordered
        headerBordered
      >
        <ProCard colSpan="30%">
          <img
            alt="example"
            style={{ borderRadius: '10%', width: '360px', height: '360px' }}
            src={current?.goodsVo?.goodsImage}
          />
        </ProCard>
        <ProCard title={<Title level={4}>{current?.goodsVo?.goodsName}</Title>}>
          <Tooltip
            title={
              current?.result.baseFee +
              '+' +
              current?.result.operationFee +
              'volWeight:' +
              current?.result.volWeight +
              'ActWeight:' +
              current?.result.actWeight +
              'shippingFee'
            }
          >
            <Title level={2}>$ {current?.result.totalFee}</Title>
          </Tooltip>
          <ProDescriptions>
            <ProDescriptions.Item label="Product Availability">
              Ready To Ship（RTS）
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Shipping days">
              {current?.result.time}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Shipping line">
              {current?.result.carrierName}
            </ProDescriptions.Item>
          </ProDescriptions>
          <Link href="http://www.zesty.com">Reference link</Link>
          <Divider dashed />
          <Form form={form}>
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
                      {item.skuName}
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
      </ProCard>
      <Footer />
    </PageContainer>
  );
};

export default Quote;
