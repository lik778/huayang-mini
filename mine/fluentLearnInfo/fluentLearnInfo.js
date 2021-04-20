import { getFluentCardNewkecheng, getFluentLearnInfo } from "../../api/mine/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    desc: "",
    features: [],
    video: "",
    video_cover: "",
    newList: [],
    equityImages: ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618825754dxzZTH.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618825754nyGpJw.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618825754xhlddI.jpg"], // 权益图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCardInfo()
    this.getNewkecheng()
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
    bxPoint("changxue_card", {})
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
   * 跳转到视频详情页
   * @param e
   */
  goToVideoDetail(e) {
    let {id, name, desc} = e.currentTarget.dataset.item
    bxPoint("changxue_card_course_Learn", {
      series_id: id,
      kecheng_name: name,
      kecheng_subname: desc,
    }, false)
    wx.navigateTo({
      url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
    })
  },
  /**
   * 跳转到首页
   */
  goToDiscovery() {
    bxPoint("changxue_card_learn_click", {}, false)
    wx.reLaunch({url: "/pages/discovery/discovery"})
  },
  /**
   * 分享按钮点击事件
   */
  onShareBtnTap() {
    bxPoint("changxue_card_post", {}, false)
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
  },
  /**
   * 获取学生卡权益
   */
  getCardInfo() {
    getFluentLearnInfo().then(({data}) => {
      data.features = data.features.map(n => ({...n, titleAry: n.title.split('\n')}))
      this.setData({
        name: data.card_name,
        desc: data.description,
        features: data.features,
        video: data.video,
        video_cover: data.video_cover
      })
    })
  },
  /**
   * 获取最新课程
   */
  getNewkecheng() {
    getFluentCardNewkecheng({limit: 5}).then(({data}) => {
      data = data || []
      let list = data.map(item => ({
        id: item.kecheng_series.id,
        name: item.kecheng_series.teacher_desc,
        desc: item.kecheng_series.name,
        visit_count: item.kecheng_series.visit_count,
        teacherImg: item.teacher.avatar,
        coverImg: item.kecheng_series.cover_pic,
        teacherTxt: `${item.teacher.name}老师 ${item.teacher.teacher_desc}`
      }))
      this.setData({newList: list})
    })
  }
})
