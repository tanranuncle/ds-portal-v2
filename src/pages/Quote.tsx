import { Footer } from '@/components';
import { Helmet } from '@@/exports';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Affix, Card, Divider, Form, Select } from 'antd';
import React from 'react';
import { useParams } from 'umi';

const Quote = () => {
  const [current, setCurrent] = React.useState<API.Goods>();

  const goodsSn = useParams<{ sn: string }>().sn;

  React.useEffect(() => {
    setCurrent({
      goodsId: 1,
      goodsSn: 'asdf',
      goodsType: 1,
      goodsName: '测试商品',
      depot: '测试仓库',
      remark: '测试备注',
      goodsTags: ['red'],
    });
  }, []);

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
      <Affix
        offsetTop={500}
        style={{ position: 'absolute', right: 50 }}
        onChange={(affixed) => console.log(affixed)}
      >
        <Form>
          <Form.Item label="Country" name="country">
            <Select
              placeholder="Select a country"
              defaultValue="US"
              style={{ width: 150 }}
              options={[
                {
                  value: 'US',
                  label: 'US',
                },
                {
                  value: 'CN',
                  label: 'CN',
                },
                {
                  value: 'JP',
                  label: 'JP',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Affix>
      <Card
        bordered
        size={'small'}
        hoverable
        cover={
          <img
            alt="example"
            src="https://xiuxiupro-material-center.meitudata.com/poster/8c98b88845630b4afc694e90ca81daa2.png"
          />
        }
        style={{ marginBlockStart: 8, width: 800, marginLeft: 'auto', marginRight: 'auto' }}
      >
        <Card.Meta
          title={current?.goodsName}
          description={
            <>
              {current?.remark}
              <Divider dashed />
              <ProDescriptions title={'1/SUPPLIER'}>
                <ProDescriptions.Item label="Vendor">Zesty</ProDescriptions.Item>
                <ProDescriptions.Item label="Stock Availability">RTS</ProDescriptions.Item>
                <ProDescriptions.Item label="Referece link">
                  http://www.zesty.com
                </ProDescriptions.Item>
                <ProDescriptions.Item label="Cost">8$ US</ProDescriptions.Item>
              </ProDescriptions>
            </>
          }
        />
      </Card>
      <Footer />
    </PageContainer>
  );
};

export default Quote;
