import { request } from '@umijs/max';

/** 获取询价单列表 */
export async function inquiryList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const response = await request<API.Inquiry>('/api/enquiry/list', {
    method: 'POST',
    data: {
      ...params,
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
    respData.data = response.data.orderList;
    respData.total = response.data.total;
  }
  // console.log(respData)
  return respData;
}

/** 获取询价单详情 */
export async function getById(id: number) {
  const response = await request<API.Inquiry>('/api/enquiry/detail/' + id, {
    method: 'GET',
  });
  return response.data;
}

/** 新增询价单 */
export async function addInquiry(inquiry: API.Inquiry) {
  return request<API.Inquiry>('/api/enquiry/addEnquiryOrder', {
    method: 'POST',
    data: inquiry,
  });
}

/** 删除询价单 */
export async function removeInquiry(options?: { [key: string]: any }) {
  console.log(options);
  return request<Record<string, any>>('/api/enquiry/deleteEnquiryOrder', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

export async function addInquiryItem(item: API.InquiryItem) {
  return request<API.Inquiry>('/api/enquiry/addEnquiryOrderGoods', {
    method: 'POST',
    data: item,
  });
}

/** 删除询价单商品 */
export async function deleteInquiryItem(item: API.InquiryItem) {
  return request('/api/enquiry/deleteEnquiryOrderGoods', {
    method: 'POST',
    data: item,
  });
}

/** 绑定询价单商品SN */
export async function bindInquiryItem(relation) {
  return request('/api/enquiry/updateGoodsSn', {
    method: 'POST',
    data: relation,
  });
}
