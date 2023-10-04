import { Footer } from '@/components';
import QuoteGrid from '@/pages/Quote/QuoteGrid';
import QuoteList from '@/pages/Quote/QuoteList';
import { quote } from '@/services/apis/goods';
import { Helmet } from '@@/exports';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Form, message, Segmented, Space } from 'antd';
import React from 'react';
import { history, useLocation, useParams } from 'umi';

window.addEventListener('hashchange', function (e) {
  console.log('changed');
});

const Quote = () => {
  const [view, setView] = React.useState('Grid');
  const [current, setCurrent] = React.useState();
  const [selected, setSelected] = React.useState();
  const [countries, setCountries] = React.useState([]);
  const [result, setResult] = React.useState();
  const [form] = Form.useForm();

  const goodsSn = useParams<{ sn: string }>().sn;
  const version = useParams<{ version: string }>().version;
  const location = useLocation();
  const getGoodsQuote = async () => {
    const res = await quote(goodsSn, version);
    setCurrent(res.data);
    setCountries(Array.from(new Set(res.data.quoteList.map((x) => x.country))));
    const hash = location.hash;
    var selected;
    if (hash) {
      try {
        const params = new URLSearchParams(hash.substring(1));
        selected = {
          skuId: parseInt(params.get('skuId')),
          country: params.get('country'),
          quantity: parseInt(params.get('quantity')),
          channelType: parseInt(params.get('channelType')),
        };
      } catch (e) {
        message.error('params error', e);
      }
    } else {
      selected = { ...res.data?.quoteList[0], quantity: 1 };
    }
    console.log(selected);
    setSelected(selected);
    form.setFieldsValue(selected);
    setQuoteDetail(res.data?.quoteList, selected);
  };

  const onFormChanged = () => {
    const selected = {
      skuId: form.getFieldValue('skuId'),
      country: form.getFieldValue('country'),
      quantity: form.getFieldValue('quantity'),
      channelType: form.getFieldValue('channelType'),
    };
    history.replace({
      pathname: location.pathname,
      hash:
        'country=' +
        form.getFieldValue('country') +
        '&quantity=' +
        form.getFieldValue('quantity') +
        '&skuId=' +
        form.getFieldValue('skuId') +
        '&channelType=' +
        form.getFieldValue('channelType'),
    });
    setQuoteDetail(current?.quoteList, selected);
  };

  const setQuoteDetail = (quoteList, selected) => {
    const quoteDetail = quoteList?.filter(
      (x) =>
        x.skuId === selected.skuId &&
        x.country === selected.country &&
        x.channelType === selected.channelType,
    )[0];
    console.log('quoteDetail', quoteDetail);
    if (quoteDetail) {
      var amount;
      if (selected.quantity === 1) {
        amount = quoteDetail.amount1Pcs;
      } else if (selected.quantity === 2) {
        amount = quoteDetail.amount2Pcs;
      } else if (selected.quantity === 3) {
        amount = quoteDetail.amount3Pcs;
      } else {
        message.error('unsupported quantity : ' + selected.quantity);
      }
      setResult({ ...quoteDetail, amount: amount });
    } else {
      message.error(
        'no quote for country : ' +
          selected.country +
          ' skuId : ' +
          selected.skuId +
          ' channel: ' +
          (selected.channelType === 1 ? 'Normal' : 'Fast'),
      );
    }
  };

  React.useEffect(() => {
    getGoodsQuote();
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
    <PageContainer
      title={
        <Space>
          <img style={{ width: '120px', height: '30px' }} alt="logo" src="/logo.png" />
          Zesty Background
          <Segmented
            defaultValue="Grid"
            options={[
              {
                value: 'Grid',
                icon: <AppstoreOutlined />,
              },
              {
                value: 'List',
                icon: <BarsOutlined />,
              },
            ]}
            onChange={(value) => {
              setView(value);
            }}
          />
        </Space>
      }
      className={containerClassName}
    >
      <Helmet>
        <title>
          {'报价单'}- {goodsSn}
        </title>
      </Helmet>
      {view === 'Grid' ? (
        <QuoteGrid
          quoteDto={current}
          countries={countries}
          selected={selected}
          result={result}
          form={form}
          onFormChanged={onFormChanged}
        />
      ) : (
        <QuoteList quoteDto={current} />
      )}
      <Footer />
    </PageContainer>
  );
};

export default Quote;
