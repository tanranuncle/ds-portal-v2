import { request } from '@umijs/max';
import { message } from 'antd';

export const depotEnum = {
  yw: { text: '义乌仓库' },
  gz: { text: '广州仓库' },
};

export const tagEnumMap = {
  '0': { text: '-', desc: '-' },
  '1': { text: 'RTS', color: 'green', desc: 'Ready To Ship(RTS)' },
  '2': { text: 'Similar', color: 'blue', desc: 'Similar' },
  '3': { text: 'WFP', color: 'red', desc: 'Wait For Production(WFP)' },
};

export async function supportedCountries() {
  const response = await request('/api/quote/supportedCountries', {
    method: 'GET',
  });
  console.log(response);
  return response.data.map((x: string) => ({ label: x, value: x }));
}

/** 获取商品列表 */
export async function getGoodsList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const response = await request<API.Goods>('/api/goods/list', {
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
    respData.data = response.data.goodsList;
    respData.total = response.data.total;
  }
  // console.log(respData)
  return respData;
}

/** 新增商品 */
export async function addGoods(goods: API.Goods) {
  return request<API.Goods>('/api/goods/addGoods', {
    method: 'POST',
    data: goods,
  });
}

/** 编辑商品 */
export async function editGoods(goods: API.Goods) {
  return request<API.Goods>('/api/goods/updateGoods', {
    method: 'POST',
    data: goods,
  });
}

/** 删除商品 */
export async function deleteGoods(goods: API.Goods) {
  return request<API.Goods>('/api/goods/deleteGoods', {
    method: 'POST',
    data: goods,
  });
}

/** 获取商品详情 */
export async function getDetail(id: number) {
  const response = await request<API.Goods>('/api/goods/detail/' + id, {
    method: 'GET',
  });
  let goodsDetail;
  if (response.code === 200) {
    goodsDetail = response.data;
  } else {
    message.error(response.message);
  }
  return goodsDetail;
}

export async function addSku(sku: API.Sku) {
  return request<API.Sku>('/api/goods/addSku', {
    method: 'POST',
    data: sku,
  });
}

export async function updateSku(sku: API.Sku) {
  return request<API.Sku>('/api/goods/updateSku', {
    method: 'POST',
    data: sku,
  });
}

export async function deleteSku(skuId: number) {
  return request<API.Sku>('/api/goods/deleteSku', {
    method: 'POST',
    data: {
      skuId: skuId,
    },
  });
}

export async function getComment(goodsId: number) {
  const response = await request<any>('/api/goods/' + goodsId + '/comments/', {
    method: 'GET',
  });
  const comments = response.data;
  console.log(comments);
  return response;
}

export async function addComment(comment) {
  return request<any>('/api/goods/' + comment.goodsId + '/comments', {
    method: 'POST',
    data: comment,
  });
}

/** 删除商品记录 */
export async function deleteComment(commentId: number) {
  return request<any>('/api/goods/deleteComment', {
    method: 'POST',
    data: { recId: commentId },
  });
}

export function fallbackImageData() {
  const fallbackImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';
  return fallbackImage;
}

export async function saveQuote(record: Record<any, any>) {
  const response = await request('/api/quote/' + record.goodsId, {
    method: 'POST',
    data: record,
  });
  return response;
}

export function quoteHistory(goodsId: number) {
  return request<any>('/api/quote/' + goodsId + '/history', {
    method: 'GET',
  });
}

export function quote(goodsSn: string, version: string) {
  return request<any>('/api/quote/' + goodsSn + '/list/' + (version ? version : 'latest'), {
    method: 'GET',
  });
}

export function getQuoteConfig() {
  return request<any>('/api/quote/config', {
    method: 'GET',
  });
}

export function updateQuoteConfig(key: string, value: string) {
  return request<any>('/api/quote/config/' + key, {
    method: 'PUT',
    data: { value: value },
  });
}

/**
 * 导出sku列表
 * @param goodsId
 */
export async function exportSkuList(goodsId) {
  const response = await request('/api/goods/exportSkuList/' + goodsId, {
    method: 'post',
    responseType: 'blob',
    data: {},
  });
  var link = document.createElement('a');
  link.download = 'SkuListExport.xlsx';
  link.href = window.URL.createObjectURL(response);
  link.click();
  window.URL.revokeObjectURL(link.href);
  return response;
}

export async function getGoodsChannels(goodsId: number) {
  const response = await request<API.GoodsChannelType[]>('/api/goods/' + goodsId + '/channels', {
    method: 'GET',
  });
  return response;
}

export async function editGoodsChannel(channelConfigs: API.GoodsChannelType[]) {
  const response = await request<API.GoodsChannelType>('/api/goods/channels/config', {
    method: 'POST',
    data: channelConfigs,
  });
  return response;
}

export async function deleteGoodsChannel({ goodsId, countryCode }: API.GoodsChannelType) {
  const response = await request<API.GoodsChannelType>(
    '/api/goods/' + goodsId + '/channels/' + countryCode,
    {
      method: 'DELETE',
    },
  );
  return response;
}
