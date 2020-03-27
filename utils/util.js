const md5 = require("md5")
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 查询token
const queryToken = () => {
  let memberUserInfo = "userInfo"; //普通平台成员用户信息,
  return wx.getStorageSync(memberUserInfo) || {};
}
// 唤起微信支付
const requestPayment = (params) => {
  let datas=getSign({
    prepay_id: params.prepay_id,
    key: params.key
  })
  console.log(datas)
  // wx.requestPayment({
  //   timeStamp: params.timeStamp,
  //   nonceStr: '',
  //   package: params.package,
  //   signType: params.signType,
  //   paySign: ,
  //   success(res) {},
  //   fail(res) {}
  // })
}
// 生成支付的一系列数据sign
const getSign = (paramsData) => {
  let params = {
    appId: "wx5705fece1e1cdc1e",
    timeStamp: parseInt(new Date().getTime() / 1000).toString(),
    nonceStr: Math.random()
      .toString(36)
      .substring(2),
    signType: "MD5",
    package: `prepay_id=${paramsData.prepay_id}`
  };
  let paramsList = [
    "appId",
    "timeStamp",
    "nonceStr",
    "package",
    "signType"
  ];
  paramsList = paramsList.sort();
  let paramStr = "";
  for (let i = 0; i < paramsList.length; i++) {
    paramStr += paramsList[i] + "=" + params[paramsList[i]] + "&";
  }
  let paySign =md5(
    paramStr + `key=${paramsData.key}` //商户Key
  );
  params["paySign"] = paySign.toUpperCase();
  return params;
}

// 格式化数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  queryToken,
  requestPayment
}