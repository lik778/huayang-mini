// subCourse/cooperationPage/cooperation.js
import {
  getCooperationById,
  cooperationJoinVideoCourse
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [{
      url: 'https://pic1.zhimg.com/v2-5b5a2fa02cb65f2ab1910439fec5791f_l.jpg'
    }, {
      url: 'https://pic1.zhimg.com/v2-5b5a2fa02cb65f2ab1910439fec5791f_l.jpg'
    }], //banner图列表
    currentBannerIndex: 0, //banner下标
    logoStyle: 0, //logo样式，0代表横版，1代表竖版
    allData: '', //课程包信息
    didShowAuth: false, //显示授权弹窗
    authType: '', //0授完权跳往课程详情1跳往学院作业秀
    currentGetVideoId: ''
  },

  // 取消授权
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  // 确认授权
  authCompleteEvent(e) {
    this.setData({
      didShowAuth: false
    })
    if (this.data.authType === 0) {
      cooperationJoinVideoCourse({
        user_id: getLocalStorage(GLOBAL_KEY.userId),
        series_id: this.data.currentGetVideoId
      }).then(res => {
        if (res.code === 0) {
          wx.navigateTo({
            url: `/subCourse/videoCourse/videoCourse?videoId=${this.data.currentGetVideoId}&from_co_channel=true`,
          })
          this.setData({
            currentGetVideoId: '',
            authType: ''
          })
        }
      })
    } else {
      this.setData({
        currentGetVideoId: '',
        authType: ''
      })
      let colleage = this.data.allData.collaborate.work_belong
      colleage = colleage === "fashion" ? 2 : colleage === "fitness" ? 1 : 3
      wx.navigateTo({
        url: `/subCourse/themeTask/themeTask?kecheng_type=1&kecheng_id=${colleage}&from_co_channel=true`,
      })
    }
  },

  // 判断logo是横版还是竖版
  checkLogoStyle(image) {
    return new Promise(resolve => {
      wx.downloadFile({
        url: image,
        success: (res) => {
          if (res.statusCode === 200) {
            wx.getImageInfo({
              src: res.tempFilePath,
              success: (res1) => {
                this.setData({
                  logoStyle: res1.height > res1.width ? 0 : 1
                })
                resolve()
              }
            })
          }
        }
      })

    })
  },

  // 返回首页
  toIndex() {
    bxPoint("co_channel_find_more", {
      co_channel_id: this.data.allData.collaborate.id,
      co_channel_tag: 'co_lndx'
    }, false)
    getApp().globalData.from_co_channel = true
    wx.switchTab({
      url: '/pages/discovery/discovery',
    })
  },

  // 跳往课程详情
  toCourseDetail(e) {
    let courseData = e.currentTarget.dataset.item
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
    if (!userInfo) {
      this.setData({
        authType: 0,
        didShowAuth: true,
        currentGetVideoId: courseData.kecheng_series.id
      })
      return
    }
    this.coursePoint(courseData)
    cooperationJoinVideoCourse({
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      series_id: courseData.kecheng_series.id
    }).then(res => {
      if (res.code === 0) {
        wx.navigateTo({
          url: `/subCourse/videoCourse/videoCourse?videoId=${courseData.kecheng_series.id}&from_co_channel=true`,
        })
      }
    })
  },

  // 点击课程卡片打点
  coursePoint(e) {
    bxPoint("co_channel_course_Learn", {
      co_channel_id: this.data.allData.collaborate.id,
      co_channel_title: this.data.allData.collaborate.collaborator,
      co_channel_tag: 'co_lndx',
      series_id: e.kecheng_series.id,
      kecheng_name: e.kecheng_series.teacher_desc,
      kecheng_subname: e.kecheng_series.name,
    }, false)
  },

  // 发布课程作业
  toCollegeIndex() {
    bxPoint("co_channel_practice", {
      co_channel_id: this.data.allData.collaborate.id,
      co_channel_tag: 'co_lndx'
    }, false)
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
    if (!userInfo) {
      this.setData({
        authType: 1,
        didShowAuth: true
      })
      return
    }
    let colleage = this.data.allData.collaborate.work_belong
    colleage = colleage === "fashion" ? 2 : colleage === "fitness" ? 1 : 3
    wx.navigateTo({
      url: `/subCourse/themeTask/themeTask?kecheng_type=1&kecheng_id=${colleage}&from_co_channel=true`,
    })
  },

  // 切换banner下标
  changeCurrentBannerIndex(e) {
    this.setData({
      currentBannerIndex: e.detail.current
    })
  },

  // banner跳转
  bannerNavigation() {
    let type = this.data.allData.collaborate.banner_type
    // banner_url配置规则：/pages/discovery/discovery
    this.bannerPoint()
    if (type === 1) {
      // 小程序页面
      let url = this.data.allData.collaborate.banner_url
      if (url === '/pages/discovery/discovery' || url === '/pages/practice/practice' || url === '/pages/userCenter/userCenter') {
        wx.switchTab({
          url: this.data.allData.collaborate.banner_url,
        })
      } else {
        wx.navigateTo({
          url: this.data.allData.collaborate.banner_url,
        })
      }
    } else if (type === 2) {
      let link = encodeURIComponent(this.data.allData.collaborate.banner_url)
      // 公众号文章页
      wx.navigateTo({
        url: `/subCourse/noAuthWebview/noAuthWebview?link=${link}`
      })
    }
  },

  // banner跳转打点
  bannerPoint() {
    let data = this.data.allData
    bxPoint("co_channel_banner", {
      co_channel_id: data.collaborate.id,
      co_channel_tag: 'co_lndx',
      co_channel_banner_src: data.collaborate.banner_pic.join(',') || '',
      co_channel_banner_url: data.collaborate.banner_url,
      co_channel_banner_mode: data.collaborate.banner_type,
    }, false)
  },

  // 获取合作包信息
  getData(id) {
    getCooperationById({
      snow_id: id
    }).then(res => {
      if (res.code === 0) {
        console.log(res.data)
        let list = res.data.kecheng_list
        res.data.collaborate.logo_list = res.data.collaborate.logo_list ? res.data.collaborate.logo_list.split(",") : []
        res.data.collaborate.banner_pic = res.data.collaborate.banner_pic ? res.data.collaborate.banner_pic.split(",") : []
        if (list.length > 0) {
          list.map(item => {
            if (item.kecheng_series.visit_count >= 10000) {
              item.kecheng_series.visit_count = (item.kecheng_series.visit_count / 10000).toFixed(1) + "万"
              item.kecheng_series.visit_count = item.kecheng_series.visit_count.split('.')[1] === '0万' ? item.kecheng_series.visit_count[0] + "万" : item.kecheng_series.visit_count
            }
          })
        }
        if (res.data.collaborate.logo_list.length > 0) {
          this.checkLogoStyle(res.data.collaborate.logo_list[0]).then(() => {
            this.pvPoint(res.data)
            this.setData({
              allData: res.data
            })
          })
        }
      }
    })
  },

  // 页面pv打点
  pvPoint(e) {
    bxPoint("co_channel_page", {
      co_channel_id: e.collaborate.id,
      co_channel_title: e.collaborate.collaborator,
      co_channel_kecheng_id: e.collaborate.kecheng_list,
      co_channel_tag: "co_lndx"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      packageId = ''
    } = options
    if (packageId === '') {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
      return
    }
    console.log('packageId=' + packageId)
    this.getData(packageId)

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
    // 分享打点
    bxPoint("co_channel_share", {
      co_channel_id: this.data.allData.collaborate.id,
      co_channel_tag: 'co_lndx'
    }, false)
  }
})