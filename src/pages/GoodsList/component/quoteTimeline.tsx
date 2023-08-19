import { quoteHistory, saveQuote } from '@/services/apis/goods';
import { ModalForm, ProFormDateTimePicker, ProFormText } from '@ant-design/pro-components';
import { Button, Empty, message, Space, Timeline } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

export type QuoteParams = {
  goodsId: number;
  goodsSn: string;
};

export type QuoteMFParams = {
  goodsId: number;
  goodsSn: string;
  trigger: any;
  onSave: () => void;
};

export const QuoteMF: React.FC<QuoteMFParams> = ({ goodsId, goodsSn, trigger, onSave }) => {
  return (
    <ModalForm
      initialValues={{ goodsId: goodsId }}
      key="addQuote"
      title={
        <Space>
          新增报价
          <a
            onClick={() => {
              window.open('/goodsQuote/' + goodsSn + '/preview', '_blank');
            }}
          >
            预览
          </a>
        </Space>
      }
      onFinish={async (values) => {
        console.log(values);
        const params = { ...values, version: moment(values.effectTime).unix() };
        console.log(params);
        await saveQuote(params).then(() => {
          message.success('提交成功');
          onSave();
        });
        return true;
      }}
      trigger={trigger}
    >
      <ProFormText name="goodsId" hidden disabled />
      <ProFormText
        width="md"
        name="name"
        label="报价描述"
        placeholder="请输入描述信息"
        rules={[{ required: true, message: '请输入描述信息' }]}
      />
      <ProFormDateTimePicker
        name="effectTime"
        label="生效时间"
        width="md"
        rules={[{ required: true, message: '请选择生效时间' }]}
      />
    </ModalForm>
  );
};

const QuoteTimeline: React.FC<QuoteParams> = ({ goodsId, goodsSn }) => {
  const [current, setCurrent] = useState([]);
  const fetchHistory = () => {
    quoteHistory(goodsId).then((res) => {
      console.log(res.data);
      const items = res.data.map((item) => {
        return {
          children: (
            <>
              <p>
                <a
                  onClick={() => {
                    window.open('/goodsQuote/' + goodsSn + '/' + item.version, '_blank');
                  }}
                >
                  {item.quoteName}{' '}
                </a>
              </p>
              <p>生效时间：{moment(item.version * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
              <p>创建时间：{moment(item.createdAt * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
            </>
          ),
        };
      });
      setCurrent(items);
    });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return current.length ? (
    <Space direction="vertical" size="large">
      <QuoteMF
        goodsId={goodsId}
        goodsSn={goodsSn}
        trigger={<Button type="primary">新增报价</Button>}
        onSave={fetchHistory}
      />
      <Timeline items={current} />
    </Space>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}>
      <QuoteMF
        goodsId={goodsId}
        goodsSn={goodsSn}
        trigger={<Button type="primary">新增报价</Button>}
        onSave={fetchHistory}
      />
    </Empty>
  );
};

export default QuoteTimeline;
