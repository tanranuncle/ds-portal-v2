// @ts-ignore
/* eslint-disable */

declare namespace API {
  type User = {
    id: number;
    name: string;
    password?: string;
    roles: string[];
  };

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type Inquiry = {
    enquiryOrderId: string;
    enquiryOrderSn: string;
    enquiryOrderName: string;
    customerInfo: string;
    gmtCreated: number;
  };

  type InquiryItem = {
    id: string;
    name: string;
    link: string;
    tag?: string;
    goodsSn?: string;
  };

  type InquiryDetail = {
    enquiryOrderId: string;
    enquiryOrderSn: string;
    enquiryOrderName: string;
    customerInfo: string;
    gmtCreated: number;
    items: InquiryItem[];
  };

  type Goods = {
    goodsId: number;
    goodsSn: string;
    goodsName: string;
    imageUrls: string[];
    remark: string;
    skuList: Sku[];
    goodsTags?: string[];
  };

  type Sku = {
    skuId: number;
    skuName: string;
    length: number;
    width: number;
    height: number;
  };

  type FeeCountryConfigType = {
    id: React.Key;
    country: string;
    shippingTime: string;
    items: FeeItemConfigType[];
  };

  type FeeItemConfigType = {
    id: React.Key;
    left?: string;
    right?: string;
    shippingFee?: string;
    extraFee?: string;
  };
}
