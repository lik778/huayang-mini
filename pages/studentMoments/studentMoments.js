// pages/studentMoments/studentMoments.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  isIphoneXRSMax
} from "../../utils/util"
import {
  getBarrageList,
  createBarrage,
  getStudentCommentList
} from "../../api/studentComments/index"

import {
  store
} from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonIcon: {
      likeIcon: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367647LTWDYU.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367660dslOOQ.jpg'],
      commentIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367678kxmCLk.jpg',
      shareIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367691MgBtuD.jpg'
    }, //点赞+评论+分享icon
    likeUserInfo: {
      avator: "https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg",
      name: "嘟嘟",
      courseName: "时尚课程"
    }, //点赞人信息
    visitUserData: {
      visitUserList: ['https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg', 'https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg', 'https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg'],
      visitNum: 239
    }, //N人在看列表
    getBarragePageData: {
      offset: 0,
      limit: 10
    }, //弹幕分页参数
    getCommentsPageData: {
      offset: 0,
      limit: 10
    }, //动态分页参数
    barrageList: [], //弹幕列表
    commentsList: [], //动态列表
    isIphoneXRSMax: isIphoneXRSMax(), //是否是x系列以上手机
    showPublishBarrage: false, //发布弹幕弹窗
    didShowContact: false, //显示客服消息弹窗

  },

  // 
  changeNum() {
    console.log(this.data.numB)
  },

  // 点击进入详情页
  toDetail() {
    wx.navigateTo({
      url: '/studentMoments/studentMomentsDetail/studentMomentsDetail',
    })
  },

  // 获取弹幕列表
  getBarrage() {
    getBarrageList(this.data.getBarragePageData).then(({
      data = []
    }) => {
      this.setData({
        barrageList: data
      })
      console.log(data)
    })
  },

  // 获取动态列表
  getCommentsList() {
    getStudentCommentList(this.data.getCommentsPageData).then(({
      data = []
    }) => {
      this.setData({
        commentsList: data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //mobx初始化
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: ['update'],
    })
    // 获取弹幕列表
    this.getBarrage()
    // 获取动态列表
    this.getCommentsList()
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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
    this.storeBindings.destroyStoreBindings()
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

  },
  // 关闭客服消息弹窗
  onCloseContactModal() {
    this.setData({
      didShowContact: false
    })
  },

  // 打开客服消息弹窗
  openContribute() {
    this.setData({
      didShowContact: true
    })
  },

  // 打开发布弹幕弹窗
  openBarrage() {
    this.setData({
      showPublishBarrage: true
    })
  },
  // 关闭发布弹幕弹窗
  closeBarrage() {
    this.setData({
      showPublishBarrage: false
    })
  },
})