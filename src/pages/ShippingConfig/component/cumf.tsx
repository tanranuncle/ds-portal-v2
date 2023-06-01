import { ChannelType, shippingCompanyEnum } from '@/services/apis/logistic';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type CUMFProps = {
  key: string;
  onCancel?: (flag?: boolean, formVals?: ChannelType) => void;
  onFinish: (values: ChannelType) => Promise<boolean>;
  trigger: any;
  title: string;
};

const ShippingConfigCUMF: React.FC<CUMFProps> = (props) => {
  return (
    <ModalForm
      title={props.title}
      key={props.key}
      width="600px"
      trigger={props.trigger}
      onFinish={props.onFinish}
    >
      <ProFormText hidden={true} width="md" name="recId" label="ID" />
      <ProFormSelect
        name="company"
        label="物流公司"
        valueEnum={shippingCompanyEnum}
        placeholder="请选择收物流公司"
        rules={[{ required: true, message: '请选择收物流公司' }]}
      />
      <ProFormText rules={[{ required: true, message: '渠道名称' }]} name="name" label="渠道" />
      <ProFormText rules={[{ required: true, message: '运输代码' }]} name="code" label="运输代码" />
      <ProFormText name="cutOffTime" label="截件时间" placeholder="截件时间" />
      <ProFormText name="costTime" label="参考时效" placeholder="参考时效" />
    </ModalForm>
  );
};

export default ShippingConfigCUMF;
