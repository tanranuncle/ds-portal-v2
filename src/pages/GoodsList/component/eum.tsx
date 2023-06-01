import { depotEnum } from '@/services/apis/goods';
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';

export type UpdateFormProps = {
  onCancel?: (flag?: boolean, formVals?: API.Goods) => void;
  onFinish: (values: API.Goods) => Promise<boolean>;
  trigger: any;
  title: string;
  updateModalOpen?: boolean;
  values?: Partial<API.Goods> | undefined;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      title={props.title}
      key="addProduct"
      width="600px"
      trigger={props.trigger}
      onFinish={props.onFinish}
      initialValues={props.values}
    >
      <ProFormText hidden={true} width="md" name="goodsId" label="商品ID" />
      <ProFormText
        rules={[{ required: true, message: '商品名称为必填项' }]}
        width="md"
        name="goodsName"
        label="商品名称"
      />
      <ProFormRadio.Group
        name="goodsType"
        label="商品类型"
        initialValue={1}
        options={[
          { label: '普通', value: 1 },
          { label: '带电', value: 2 },
          { label: '特货', value: 3 },
        ]}
      />
      <ProFormSelect
        name="depot"
        label="收获仓库"
        valueEnum={depotEnum}
        placeholder="请选择收获仓库"
        rules={[{ required: true, message: '请选择收获仓库' }]}
      />
      <ProFormText
        rules={[{ required: true, message: '请填入商品图片链接' }]}
        name="goodsImage"
        label="商品图片链接"
        placeholder="http://"
      />
      <ProFormTextArea name="remark" label="商品描述" />
    </ModalForm>
  );
};

export default UpdateForm;
