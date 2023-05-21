export type DataSourceType = {
  id: React.Key;
  country?: string;
  shippingTime?: string;
  left?: string;
  right?: string;
  shippingFee?: string;
  extraFee?: string;
  rowSpan?: number;
};

/** 获取商品列表 */
export async function getShippingConfig(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  // const response = await request<API.FeeCountryConfigType>('/api/shipping/config', {
  //   method: 'GET',
  //   data: {
  //     ...params,
  //   },
  //   ...(options || {}),
  // });
  console.log({ data: { ...params }, ...(options || {}) });

  const rawData: API.FeeCountryConfigType[] = [
    {
      id: 624748501,
      country: '英国',
      shippingTime: '5-8工作日',
      items: [
        {
          id: 1,
          left: '0',
          right: '2',
          shippingFee: '81',
          extraFee: '16',
        },
        {
          id: 2,
          left: '2',
          right: '20',
          shippingFee: '81',
          extraFee: '16',
        },
      ],
    },
    {
      id: 624691223,
      country: '美国',
      shippingTime: '6-10工作日',
      items: [
        {
          id: 1,
          left: '0',
          right: '0.1',
          shippingFee: '123',
          extraFee: '20',
        },
        {
          id: 2,
          left: '0.1',
          right: '0.2',
          shippingFee: '113',
          extraFee: '18',
        },
        {
          id: 3,
          left: '0.2',
          right: '0.45',
          shippingFee: '110',
          extraFee: '18',
        },
      ],
    },
  ];

  const r: DataSourceType[] = [];
  let lastId: React.Key = -1;
  for (let d of rawData) {
    for (let i of d.items) {
      r.push({
        country: d.country,
        shippingTime: d.shippingTime,
        ...i,
        id: d.id + '_' + i.id,
        rowSpan: d.id === lastId ? 0 : d.items.length,
      });
      lastId = d.id;
    }
  }

  //todo: 暂时在这里转换响应结构，后面需要统一拦截器处理
  let respData = {
    data: r,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: true,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: r.length,
  };
  // if (response.code === 200) {
  //   respData.success = true;
  //   respData.data = r
  //   respData.total = ;
  // }
  // console.log(respData)
  return respData;
}
