import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const columns: ProColumns<any>[] = [
  { title: 'col1', dataIndex: 'name' },
  { title: 'col2', dataIndex: 'roles' },
];

const Admin: React.FC = () => {
  return (
    <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
      <ProTable rowKey="key" columns={columns} search={false}></ProTable>
    </PageContainer>
  );
};
export default Admin;
