import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const data = [
  { name: 'admin', role: 'admin' },
  { name: 'user', role: 'user' },
];

const columns: ProColumns<any>[] = [
  { title: '用户名', dataIndex: 'name' },
  { title: '角色', dataIndex: 'role' },
];

const Admin: React.FC = () => {
  return (
    <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
      <ProTable rowKey="key" columns={columns} search={false} dataSource={data}></ProTable>
    </PageContainer>
  );
};
export default Admin;
