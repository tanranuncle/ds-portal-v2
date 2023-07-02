import { getQuoteConfig, updateQuoteConfig } from '@/services/apis/goods';
import ProCard from '@ant-design/pro-card';
import type { ProDescriptionsActionType } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useRef } from 'react';

const ParamsConfig = () => {
  const actionRef = useRef<ProDescriptionsActionType>();
  return (
    <PageContainer>
      <ProCard>
        <ProDescriptions
          column={1}
          actionRef={actionRef}
          request={getQuoteConfig}
          editable={{
            onSave: async (keypath, newInfo, oriInfo) => {
              updateQuoteConfig(keypath, newInfo[keypath]);
              console.log(keypath, newInfo, oriInfo);
              return true;
            },
          }}
        >
          <ProDescriptions.Item
            dataIndex={'exchangeRate'}
            label="汇率(USD ~ CNY)"
            valueType="digit"
          />
          <ProDescriptions.Item dataIndex={'operationFee'} label="操作费(USD)" valueType="digit" />
          <ProDescriptions.Item dataIndex={'amplifyRate'} label="溢价比" valueType="digit" />
        </ProDescriptions>
      </ProCard>
    </PageContainer>
  );
};

export default ParamsConfig;
