import { addUpdateUser, getUsers } from '@/services/ant-design-pro/api';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Avatar, Button, Form, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import moment from 'moment';

const Admin: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState(false);
  const [bindForm] = Form.useForm();
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>();

  const userStatusEnumMap = {
    '0': { text: '禁用', color: 'red' },
    '1': { text: '启用', color: 'green' },
  };

  const handleAddUpdate = async (fields: API.User) => {
    const hide = message.loading('正在处理');
    try {
      await addUpdateUser({
        ...fields,
      });
      hide();
      message.success('process successfully');
      return true;
    } catch (error) {
      hide();
      message.error('process failed, please try again!');
      return false;
    }
  };

  const showEditModal = (record) => {
    bindForm.resetFields();
    record.status = String(record.status);
    bindForm.setFieldsValue({ ...record });
    handleModalOpen(true);
    setIsAdd(false);
  };

  const columns: ProColumns<any>[] = [
    { title: '用户名', dataIndex: 'username' },
    {
      title: '头像',
      dataIndex: 'avatar',
      render(text, record) {
        return (
          <>
            <Avatar src={text} icon={<UserOutlined />} size={60} alt={record.username} />
          </>
        );
      },
    },
    { title: '角色', dataIndex: 'roleName' },
    {
      title: '状态',
      dataIndex: 'status',
      render(text, record) {
        return (
          <>
            <Tag color={userStatusEnumMap[record.status].color} key={record.recId}>
              {userStatusEnumMap[record.status].text}
            </Tag>
          </>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreated',
      render: (_, record) => [moment(record.gmtCreated * 1000).format('YYYY-MM-DD HH:mm:ss')],
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModify',
      render: (_, record) => [moment(record.gmtModify * 1000).format('YYYY-MM-DD HH:mm:ss')],
    },
    {
      title: 'Actions',
      width: '150px',
      render(text, record) {
        return (
          <>
            <a
              key="edit"
              onClick={(e) => {
                e.preventDefault();
                showEditModal(record);
              }}
            >
              编辑
            </a>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
      <ProTable
        rowKey="userId"
        columns={columns}
        search={false}
        request={getUsers}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
              setIsAdd(true);
              bindForm.resetFields();
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
      ></ProTable>

      <ModalForm
        title={isAdd ? '新建用户' : '编辑用户'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        form={bindForm}
        onFinish={async (value) => {
          const success = await handleAddUpdate(value as API.User);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              message: '用户ID',
              required: !isAdd,
            },
          ]}
          hidden={true}
          width="md"
          name="userId"
          label="用户ID"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '用户名',
            },
          ]}
          disabled={!isAdd}
          width="md"
          name="username"
          label="用户名"
        />
        <ProFormText
          rules={[
            {
              required: isAdd,
              message: '密码',
            },
          ]}
          placeholder={isAdd ? '请输入密码' : '为空则不修改'}
          width="md"
          name="password"
          label="密码"
        />

        <ProFormText
          rules={[
            {
              required: false,
              message: '头像',
            },
          ]}
          width="md"
          name="avatar"
          label="头像"
        />
        <ProFormSelect
          name="roleName"
          label="角色"
          valueEnum={{
            ADMIN: 'ADMIN',
            USER: 'USER',
          }}
          placeholder="请选择一个角色"
          rules={[{ required: true, message: '请选择一个角色!' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          hidden={isAdd}
          valueEnum={{
            '1': '启用',
            '0': '禁用',
          }}
          rules={[{ required: !isAdd, message: '请选择状态' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default Admin;
