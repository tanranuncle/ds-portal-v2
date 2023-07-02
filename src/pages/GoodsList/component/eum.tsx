import { depotEnum } from '@/services/apis/goods';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, Radio, Tabs } from 'antd';
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
      width="800px"
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
      <ProForm.Group>
        <ProFormText
          rules={[{ required: true, message: '商品名称为必填项' }]}
          width="md"
          name="goodsName"
          placeholder="请输入商品的中文名称"
          label="商品名称"
        />
        <ProFormText
          rules={[{ required: false, message: '商品英文名称为非必填项' }]}
          width="md"
          name="goodsNameEn"
          placeholder="请输入商品的英文名称"
          label="商品名称(EN)"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="depot"
          label="收获仓库"
          width="md"
          valueEnum={depotEnum}
          rules={[{ required: true, message: '请选择收获仓库' }]}
        />
        <ProFormRadio.Group
          name="goodsType"
          label="商品类型"
          required
          width="md"
          options={[
            { label: '普通', value: 1 },
            { label: '带电', value: 2 },
            { label: '特货', value: 3 },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="processingTime"
          label="处理时间"
          placeholder="e.g. 4-5 days"
        />
        <Form.Item
          label="标记"
          name="availability"
          required
          rules={[{ required: true, message: '请选择一种关联标记!' }]}
          tooltip={{ title: '选择一种关联标记', icon: <InfoCircleOutlined /> }}
        >
          <Radio.Group>
            <Radio.Button value={1} defaultChecked={true}>
              RTS
            </Radio.Button>
            <Radio.Button value={2}>Similar</Radio.Button>
            <Radio.Button value={3}>WFP</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </ProForm.Group>
      <ProFormText
        rules={[{ required: true, message: '请填入商品图片链接' }]}
        name="goodsImage"
        label="商品图片链接"
        placeholder="http://"
      />
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '商品描述',
            children: (
              <ProForm.Item
                name="remark"
                rules={[{ required: false, message: '请输入商品描述' }]}
                style={{ height: '280px' }}
              >
                <ReactQuill
                  style={{ height: '260px' }}
                  modules={quillModules}
                  value={remarkContent}
                  onChange={setRemarkContent}
                />
              </ProForm.Item>
            ),
          },
          {
            key: '2',
            label: '商品描述(EN)',
            children: (
              <ProForm.Item
                name="remarkEn"
                rules={[{ required: false, message: '请输入商品描述(EN)' }]}
                style={{ height: '280px' }}
              >
                <ReactQuill
                  style={{ height: '260px' }}
                  modules={quillModules}
                  value={remarkEnContent}
                  onChange={setRemarkEnContent}
                />
              </ProForm.Item>
            ),
          },
        ]}
      ></Tabs>
    </ModalForm>
  );
};

export default UpdateForm;
