import { depotEnum } from '@/services/apis/goods';
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export type UpdateFormProps = {
  onCancel?: (flag?: boolean, formVals?: API.Goods) => void;
  onFinish: (values: API.Goods) => Promise<boolean>;
  trigger: any;
  title: string;
  updateModalOpen?: boolean;
  values?: Partial<API.Goods> | undefined;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  /*富文本编辑*/
  const [remarkContent, setRemarkContent] = useState('');
  const [remarkEnContent, setRemarkEnContent] = useState('');
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  return (
    <ModalForm
      title={props.title}
      key="addProduct"
      width="600px"
      trigger={props.trigger}
      onFinish={props.onFinish}
      initialValues={props.values}
      onOpenChange={(visible) => {
        if (visible) {
          setRemarkContent(props.values?.remark);
          setRemarkEnContent(props.values?.remarkEn);
        }
      }}
    >
      <ProFormText hidden={true} width="md" name="goodsId" label="商品ID" />
      <ProFormText
        rules={[{ required: true, message: '商品名称为必填项' }]}
        width="md"
        name="goodsName"
        label="商品名称"
      />
      <ProFormText
        rules={[{ required: false, message: '商品英文名称为非必填项' }]}
        width="md"
        name="goodsNameEn"
        label="商品名称(EN)"
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
      <ProForm.Item
        label="商品描述"
        name="remark"
        rules={[{ required: false, message: '请输入商品描述' }]}
        style={{ height: 300 }}
      >
        <ReactQuill
          style={{ height: 200 }}
          modules={quillModules}
          value={remarkContent}
          onChange={setRemarkContent}
        />
      </ProForm.Item>
      <ProForm.Item
        label="商品描述(EN)"
        name="remarkEn"
        rules={[{ required: false, message: '请输入商品描述(EN)' }]}
        style={{ height: 300 }}
      >
        <ReactQuill
          style={{ height: 200 }}
          modules={quillModules}
          value={remarkEnContent}
          onChange={setRemarkEnContent}
        />
      </ProForm.Item>
    </ModalForm>
  );
};

export default UpdateForm;
