import request from "../../lib/request";
import { ROOT_URL } from "../../lib/config"
import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reports: [
      {title: "环球时报：万众瞩目 屏息以待 绽放 趁现在（第二季）再次起航", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644992872TkQTqS.jpg", link: "https://mp.weixin.qq.com/s/fZUjzT7iZpVIHaxIzj-xBg"},
      {title: "新民晚报：为“50后青年”提供积极、时尚的生活方式平台 “绽放·趁现在——上海花样时尚模特大赛总决赛”在东华大学举行", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644992918oQskEt.jpg", link: "https://mp.weixin.qq.com/s/2gt-xFNC9ga9S6eZBmzJHQ"},
      {title: "福布斯：花样百姓跨界时装秀来袭，罗颖“破冰50+市场，与银发新青年探索人生黄金期”", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644992988aSSJVx.jpg", link: "https://mp.weixin.qq.com/s/X6pBmQKS7lRSe3jNHy9r3A"},
      {title: "北京晚报：2021花样时尚模特大赛（北京赛区） 45+中老年闪耀T台，享时尚退休生活， 和花样百姓一起绽放·趁现在！", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644993092lpZKSz.jpg", link: "https://mp.weixin.qq.com/s/4vbTdI6GQGaOBEZMQ7F1NA"},
      {title: "上海热线：50+花样姐姐走T台！花样时尚模特大赛在沪决赛", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644993131oQJbEt.jpg", link: "https://mp.weixin.qq.com/s/2UZHdfJ00DEOJdEQIAB8YQ"},
      {title: "中新网：第二届2020上海花样时尚模特大赛全国总决赛落幕", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644993166cmeuzQ.jpg", link: "https://mp.weixin.qq.com/s/ev0_YpXO6aqdTPFSWANMjw"},
      {title: "中国新闻网：全国50后模特精英汇聚上海 走上专业T台展风采", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644993225JmfhXI.jpg", link: "https://mp.weixin.qq.com/s/JDiOtZ4UEWraknSaU7eZkQ"},
      {title: "中华网快讯：花样百姓首届时尚盛典即将揭幕", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644993822xBBrNj.jpg", link: "https://mp.weixin.qq.com/s/g4efEJDwILoA6Xaeq_ivVQ"},
      {title: "中国经济新闻网：第二届2020上海花样时尚模特大赛全国总决赛落幕", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644993166cmeuzQ.jpg", link: "https://mp.weixin.qq.com/s/ev0_YpXO6aqdTPFSWANMjw"},
      {title: "红秀：花样百姓跨界品牌秀重磅来袭", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644995136GYqfgB.jpg", link: "https://mp.weixin.qq.com/s/Fs8XlQVBsIsdMtsS-Q-lcQ"},
      {title: "搜狐：花样百姓首届时尚盛典即将揭幕", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644994461memhLz.jpg", link: "https://mp.weixin.qq.com/s/JX0Cn2-TGycxC8IUW8llTg"},
      {title: "网易新闻：八大时尚服饰品牌合作中老年秀场，实力官宣！", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644995519oFnueK.jpg", link: "https://mp.weixin.qq.com/s/-bieaGtXc3gE-v7CTx9C0w"},
      {title: "凤凰网商业：第三季 2021花样时尚模特大赛上海赛区晋级赛成功举办", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644995662PBhVMY.jpg", link: "https://mp.weixin.qq.com/s/yHNttFvSHPm8QeReCLD3Nw"},
      {title: "东方网：2020花样百姓年度颁奖盛典在沪举行", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644995783lvyOCu.jpg", link: "https://mp.weixin.qq.com/s/hG2gTl_YcANVVRRcPdnBSQ"},
      {title: "福州网：2021花样时尚模特大赛（福州赛区）正式启航！", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644995982uLiFax.jpg", link: "https://mp.weixin.qq.com/s/PD52LWKY5QOAxUOmNkiqbQ"},
      {title: "杨浦电视台新闻综合：阿姨爷叔登T台 我的精彩我做主", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644996689GuTEqy.jpg", link: "https://mp.weixin.qq.com/s/Ev01FX7tjhkOBqNVWOjYig"},
      {title: "爱奇艺：[绽放 趁现在]第二届“2020上海花样时尚模特大赛”圆满落幕", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644996728DOJJGB.jpg", link: "https://mp.weixin.qq.com/s/qzSoxWpYkkxF9LHVAPmU4Q"},
      {title: "腾讯：「绽放·趁现在」第二届“2020上海花样时尚模特大赛”", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644996764VvWHtg.jpg", link: "https://mp.weixin.qq.com/s/85ZIiWOZcNzt8-kA8z86jg"},
      {title: "优酷：第二届“2020上海花样时尚模特大赛”颁奖典礼圆满落幕", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644996796pfdssD.jpg", link: "https://mp.weixin.qq.com/s/yVHqc1-DKkHViwIHf-HotA"},
      {title: "看看新闻：“绽放·趁现在”第二届“上海花样时尚模特大赛”举办", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644998189VmqdKY.jpg", link: "https://mp.weixin.qq.com/s/EhKGAFBUQwODrQe4nXvoaQ"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    bxPoint("huayang_media_page", {})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "作为中老年行业的领头羊，花样百姓已获得百家权威媒体报道",
      path: "/statics/mediaReports/mediaReports"
    }
  },

  onItemTap(e) {
    let {link, title} = e.currentTarget.dataset.item
    bxPoint("huayang_media_list_click", {media_news_title: title}, false)
    wx.navigateTo({url: `/pages/pureWebview/pureWebview?link=${link}`});
  }
})
