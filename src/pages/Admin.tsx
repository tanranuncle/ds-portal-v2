import { getUsers } from '@/services/ant-design-pro/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const columns: ProColumns<any>[] = [
  { title: '用户名', dataIndex: 'name' },
  { title: '角色', dataIndex: 'roles' },
];

const Admin: React.FC = () => {
  return (
    <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
      <ProTable rowKey="key" columns={columns} search={false} request={getUsers}></ProTable>
    </PageContainer>
  );
};
export default Admin;
