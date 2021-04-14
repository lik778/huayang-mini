// pages/studentMoments/studentMoments.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
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
    },
    likeUserInfo: {
      avator: "https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg",
      name: "嘟嘟",
      courseName: "时尚课程"
    },
    visitUserData: {
      visitUserList: ['https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg', 'https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg', 'https://wzrylt.oss-cn-beijing.aliyuncs.com/WechatIMG46.jpeg'],
      visitNum: 239
    }

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: ['update'],
    })
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

  }
})