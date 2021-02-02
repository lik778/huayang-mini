import { GLOBAL_KEY } from "../../lib/config"
import dayjs from "dayjs"
import { getFindBanner, getPhoneNumber } from "../../api/course/index"
import { getFluentCardInfo, getUserGuideLink, getUserInfo, getUserOwnerClasses } from "../../api/mine/index"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, setLocalStorage } from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import { getTaskEntranceStatus } from "../../api/task/index"
import { getYouZanAppId } from "../../api/mall/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    didShowAuth: false,
    statusHeight: 0,
    nodata: true,
    phoneNumber: "",
    existNo: undefined,
    activity_count: 0,
    kecheng_count: 0,
    traincamp_count: 0,
    showPromotion: true,
    visibleTaskEntrance: false,
    cardBtnText: "授权登录",
    bannerList: [],
    isFluentLearnUser: false, // 畅学卡会员
    fluentCardExpireTime: undefined,
    current: 0, // banner index
  },
  /**
   * 跳转到提现页
   */
  goToConvertCashPage() {
    if (!hasUserInfo() || !hasAccountInfo()) {
      return this.setData({didShowAuth: true})
    }
    wx.navigateTo({url: "/mine/convertCash/convertCash"})
  },
  /**
   * 处理广告位点击事件
   * @param e
   */
  onBannerItemTap(e) {
    if (e.currentTarget.dataset.item.need_auth === 1) {
      if (!hasUserInfo() || !hasAccountInfo()) {
        return this.setData({didShowAuth: true})
      }
    }
    let {link, link_type, id} = e.currentTarget.dataset.item
    if (link_type === 'youzan') {
      getYouZanAppId().then(appId => {
        wx.navigateToMiniProgram({appId, path: link})})
    } else {
      wx.navigateTo({url: link})
    }
  },
  // swiper切换
  changeSwiperIndex(e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 处理畅叙卡按钮点击事件
  onFluentCardTap() {
    if (!hasUserInfo() || !hasAccountInfo()) {
      this.setData({didShowAuth: true})
    } else {
      if (this.data.isFluentLearnUser) {
        wx.navigateTo({url: "/mine/fluentLearnInfo/fluentLearnInfo"})
      } else {
        wx.navigateTo({url: "/mine/joinFluentLearn/joinFluentLearn"})
      }
    }
  },
  // 跳往我的推广
  toPromotion() {
    getUserInfo("scene=zhide").then(res => {
      setLocalStorage(GLOBAL_KEY.accountInfo, res)
      wx.navigateTo({
        url: '/mine/promotion/promotion',
      })
    }).catch(() => {
      this.setData({
        showPromotion: false
      })
    })
  },

  // 获取用户主题营、课程、活动数量数据
  queryContentInfo() {
    if (hasUserInfo() && hasAccountInfo()) {
      getUserOwnerClasses({
        user_id: getLocalStorage(GLOBAL_KEY.userId)
      }).then((data) => {
        let {
          activity_count = 0, kecheng_count = 0, traincamp_count = 0
        } = data
        this.setData({
          activity_count,
          kecheng_count,
          traincamp_count
        })
      })
    }
  },
  // 加私域
  joinPrivateDomain() {
    getUserGuideLink().then((link) => {
      wx.navigateTo({
        url: `/mine/normal-web-view/normal-web-view?link=${link}`,
        fail() {
          wx.switchTab({
            url: "pages/userCenter/userCenter"
          })
        }
      })
    })

    bxPoint("mine_sign_in_private_group", {}, false)
  },
  // 计算用户帐号创建日期
  calcUserCreatedTime() {
    if (hasUserInfo() && hasAccountInfo()) {
      let {
        created_at
      } = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      let nowDate = dayjs()
      let no = nowDate.diff(created_at, "day")
      this.setData({
        existNo: no || 1
      })
    }
  },
  // 处理用户卡片点击
  handleCardTap(e) {
    if (hasUserInfo() && hasAccountInfo()) {
      switch (e.currentTarget.dataset.ele) {
        case "bootcamp": {
          bxPoint("applet_mine_click_bootcamp", {}, false)
          wx.navigateTo({
            url: "/mine/personBootcamp/personBootcamp"
          })
          return
        }
        case "course": {
          bxPoint("applet_mine_click_course", {}, false)
          wx.navigateTo({
            url: "/mine/personCourse/personCourse"
          })
          return
        }
        case "activity": {
          bxPoint("applet_mine_click_activity", {}, false)
          wx.navigateTo({
            url: "/mine/personActivity/personActivity"
          })
          return
        }
      }
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 获取用户信息
  getUserSingerInfo() {
    getUserInfo('scene=zhide').then(res => {
      res.amount = Number(res.amount).toFixed(2)
      setLocalStorage(GLOBAL_KEY.accountInfo, res)
      this.setData({userInfo: res})
    })
  },
  getBanner() {
    getFindBanner({scene: 18}).then((list) => {
      this.setData({bannerList: list})
    })
  },
  /**
   * 请求畅销卡信息
   */
  getFluentInfo() {
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data}) => {
      if ($notNull(data)) {
        this.setData({
          isFluentLearnUser: !!data,
          fluentCardExpireTime: dayjs(data.expire_time).format("YYYY-MM-DD"),
          cardBtnText: "查看权益"
        })
      } else {
        this.setData({cardBtnText: "立即加入"})
      }
    })
  },
  // 获取授权
  getAuth() {
    if (this.data.nodata) {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 用户授权取消
  authCancelEvent() {
    this.run()
    this.setData({
      didShowAuth: false
    })
  },
  // 用户确认授权
  authCompleteEvent() {
    this.run()
    this.queryContentInfo()
    this.setData({
      didShowAuth: false
    })
  },
  // 获取个人信息
  getUserInfo() {
    this.setData({
      userInfo: getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
    })
  },
  // 我的作业
  goToTaskLaunchPage() {
    if (hasUserInfo() && hasAccountInfo()) {
      bxPoint("mine_task_layout", {}, false)
      let userId = getLocalStorage(GLOBAL_KEY.userId)
      wx.navigateTo({
        url: `/subCourse/personTask/personTask?visit_user_id=${userId}`,
      })
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 我的订单
  toOrder() {
    if (hasUserInfo() && hasAccountInfo()) {
      wx.navigateTo({
        url: '/mine/mineOrder/mineOrder',
      })
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 获取客服号码
  getNumber() {
    getPhoneNumber().then(phoneNumber => {
      this.setData({
        phoneNumber
      })
    })
  },
  // 公用方法
  kingOfTheWorld() {
    this.getUserInfo()
    this.getNumber()
    this.getUserSingerInfo()
    this.getFluentInfo()
  },
  // 联系客服
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  run() {
    // 检查是否展示作业秀入口
    getTaskEntranceStatus().then(({data}) => {
      this.setData({visibleTaskEntrance: data == 1})
    })

    if (hasUserInfo() && !hasAccountInfo()) {
      // 有微信信息没有手机号信息
      this.setData({
        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)),
        nodata: false,
      })
    } else if (hasUserInfo() && hasAccountInfo()) {
      // 有微信信息且有手机号信息
      this.kingOfTheWorld()
      this.setData({
        nodata: false,
        showPromotion: true,
        cardBtnText: "立即加入"
      })
    } else {
      // nothing
      this.setData({
        nodata: true
      })
    }

    this.calcUserCreatedTime()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    this.setData({statusHeight: data})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.run()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    this.calcUserCreatedTime()
    bxPoint("applets_mine", {})

    this.queryContentInfo()
    this.getBanner()

    if (getApp().globalData.didNeedReloadUserCenterfluentLearnCardInfo && hasAccountInfo() && hasUserInfo()) {
      this.getFluentInfo()
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
  onShareAppMessage: function (res) {
    return {
      title: '跟着花样一起变美，变自信',
      path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  }
})
