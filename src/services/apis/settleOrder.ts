import { request } from '@umijs/max';

/** 获取结算单列表 */
export async function settleOrderList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    gmtCreatedRange?: any;
    gmtCreatedStart?: number;
    gmtCreatedEnd?: number;
  },
  options?: { [key: string]: any },
) {
  let newParams = {
    ...params,
    gmtCreatedStart:
      params.gmtCreatedRange !== undefined ? Date.parse(params.gmtCreatedRange[0]) / 1000 : null,
    gmtCreatedEnd:
      params.gmtCreatedRange !== undefined ? Date.parse(params.gmtCreatedRange[1]) / 1000 : null,
  };
  delete params.gmtCreatedRange;
  const response = await request<any>('/api/settleOrder/list', {
    method: 'POST',
    data: {
      ...newParams,
    },
    ...(options || {}),
  });

  // todo: 暂时在这里转换响应结构，后面需要统一拦截器处理
  let respData = {
    data: [],
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: false,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: 0,
  };
  if (response.code === 200) {
    respData.success = true;
    respData.data = response.data.settleOrderInfoList;
    respData.total = response.data.total;
  }
  // console.log(respData)
  return respData;
}

/**
 * 导出结算单明细列表
 * @param goodsId
 */
export async function exportSettleOrderDetailList(settleOrderId) {
  const response = await request('/api/settleOrder/exportSettleOrderDetailList/' + settleOrderId, {
    method: 'post',
    responseType: 'blob',
    data: {},
  });
  var link = document.createElement('a');
  link.download = 'SettleOrderDetailListExport.xlsx';
  link.href = window.URL.createObjectURL(response);
  link.click();
  window.URL.revokeObjectURL(link.href);
  return response;
}
