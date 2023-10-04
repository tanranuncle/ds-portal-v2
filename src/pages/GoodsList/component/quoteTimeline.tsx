import { quote, quoteHistory, saveQuote } from '@/services/apis/goods';
import {
  EditableProTable,
  ModalForm,
  ProColumns,
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
} from '@ant-design/pro-components';
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

type DataSourceType = {
  keyId: string;
  skuId: number;
  country: string;
  channelCode: string;
  amount1Pcs: number;
  amount2Pcs: number;
  amount3Pcs: number;
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: 'skuId',
    dataIndex: 'skuId',
    readonly: true,
  },
  {
    title: 'country',
    dataIndex: 'country',
    readonly: true,
  },
  {
    title: '物流线路',
    dataIndex: 'channelCode',
    readonly: true,
    // render: (text, row) => {
    //   return <>{row.channelType === 1 ? "普线" : "快线" + "(" + text + ")"}</>
    // }
  },
  {
    title: '1pcs报价',
    dataIndex: 'amount1Pcs',
    valueType: 'digit',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项是必填项',
        },
      ],
    },
  },
  {
    title: '2pcs报价',
    dataIndex: 'amount2Pcs',
    valueType: 'digit',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项是必填项',
        },
      ],
    },
  },
  {
    title: '3pcs报价',
    dataIndex: 'amount3Pcs',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项是必填项',
        },
      ],
    },
  },
];

export const QuoteMF: React.FC<QuoteMFParams> = ({ goodsId, goodsSn, trigger, onSave }) => {
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();

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
      onOpenChange={(open: boolean) => {
        if (open) {
          quote(goodsSn, 'preview').then((value) => {
            if (value.code === 200) {
              console.log(value.data.quoteList);
              setDataSource(value.data.quoteList);
              const editableKeys = value.data.quoteList.map((item) => item.keyId);
              console.log(editableKeys);
              setEditableRowKeys(editableKeys);
            }
          });
        } else {
          setDataSource([]);
          setEditableRowKeys([]);
        }
      }}
      onFinish={async (values) => {
        console.log(values);
        const params = {
          ...values,
          version: moment(values.effectTime).unix(),
          quoteList: dataSource,
        };
        console.log(params);
        await saveQuote(params).then(() => {
          message.success('提交成功');
          onSave();
        });
        return true;
      }}
      trigger={trigger}
    >
      <ProFormGroup>
        <ProFormText name="goodsId" hidden disabled />
        <ProFormText
          width="md"
          name="quoteName"
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
      </ProFormGroup>
      <EditableProTable<DataSourceType>
        id="part-1"
        // headerTitle="可编辑表格"
        columns={columns}
        rowKey="keyId"
        scroll={{
          x: 600,
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          editableKeys,
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
        }}
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
