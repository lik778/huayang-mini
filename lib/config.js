// 全局key
export const GLOBAL_KEY = {
    userInfo: 'hy_applets_user_info', // token key
    openId: 'hy_applets_openid', // openId
    token: 'hy_applets_token', // token
    userId: 'hy_applets_userId', // userId
    adImageList: 'hy_ad_images_list', // ad image list
    formIdNo: 'hy_form_id_no', // 缓存formId的条数
    accountInfo: 'hy_account_info', // 积分账户
    exchangeResult: 'hy_exchange_result', // 兑换结果
    statusBarHeight: 'hy_status_bar_height', // 设备状态栏高度
    systemParams: 'hy_system_params', // 所有设备状态字段
    mediaInfoImageTips: 'hy_media_info_image_tips', // 内容详情页查看图片提示
    mediaInfoShareTips: 'hy_media_info_share_tips' // 内容详情页分享功能提示
};

// 请求来源
export const APP_ID = {
    h5: '1',
    pc: '2',
    applets: '3',
    app: '4',
    admin: '5'
};

// 用户来源
export const USER_ID = {
    h5: '1',
    relation: '2',
    admin: '3'
};

// 注册方式
export const METHOD_TYPE = {
    h5: 1,
    applets: 2
};

// 验证码类型
export const CaptchaType = {
    msg: '1',
    pic: '2'
};

// secret config
export const SECRET = {
    h5: 'hyh5@2019',
    pc: 'hypc@2019',
    app: 'hyapp@2019',
    applets: 'hyapplets@2019',
    crm: 'hycrm@2019'
};

// root url
export const ROOT_URL = {
    dev: 'https://huayang.baixing.cn',
    prd: 'https://huayang.baixing.com/'
};

// interface prefix
export const prefix = '/hy';

// interface
export const URL = {

};

// 登录、注册、忘记密码场景
export const BusinessCode = {
    register: '1',
    login: '2',
    forget: '3'
};

// 签到来源
export const CHECK_IN_TYPE = {
    register: '新用户注册',
    checkin: '签到',
    invite_register: '邀请注册',
    buy_vip: '积分兑换VIP'
};

// 用户标签
export const TAG_TYPE = {
    gold: 'gold_envoy' // 金色大使
};

// 临时键
export const TEMPORARY_KEY = {
    openid: 'temporary_user_openid' // 访客token
};

// applet ids
export const APP_LET_ID = {
    bx: 'wx2340a4f2bcb09576',
    tx: 'wxe892a319545c9b45'
};

// 微信授权类型
export const WX_AUTH_TYPE = {
    userInfo: 'scope.userInfo',
    writePhotosAlbum: 'scope.writePhotosAlbum'
};