import { request } from '@umijs/max';

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

/** 获取商品详情 */
export async function getDetail(id: number) {
  const response = await request<API.Goods>('/api/goods/detail/' + id, {
    method: 'GET',
  });
  const goodsDetail = response.data;
  goodsDetail.imageUrls = [
    'https://cbu01.alicdn.com/img/ibank/2019/531/659/10434956135_1177513472.jpg',
    'https://cbu01.alicdn.com/img/ibank/2019/531/659/10434956135_1177513472.jpg',
  ];
  return goodsDetail;
}

export async function addSku(sku: API.Sku) {
  return request<API.Sku>('/api/goods/addSku', {
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
  //return comments;
  return {
    success: true,
    data: [
      {
        user: 'asd',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
        content: 'asdfdsdfsadf',
      },
      {
        user: 'asd',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
        content: 'asdfdsdfsadf',
      },
    ],
    total: 2,
  };
}

export async function addComment(comment) {
  return request<any>('/api/goods/addComment', {
    method: 'POST',
    data: comment,
  });
}
