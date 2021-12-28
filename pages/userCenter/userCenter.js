import { FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import dayjs from "dayjs"
import { getFindBanner, getPhoneNumber } from "../../api/course/index"
import {
  getFluentCardInfo,
  getFluentLearnInfo,
  getUserInfo, getUserPersonPageInfo,
} from "../../api/mine/index"
import {
  $notNull,
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  setLocalStorage,
  splitTargetNoString
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import { getTaskEntranceStatus } from "../../api/task/index"
import { getYouZanAppId } from "../../api/mall/index"

const Level = [{
    label: "准合伙人",
    value: 0,
  }, {
    label: "初级合伙人",
    value: 1,
  },
  {
    label: "中级合伙人",
    value: 2,
  },
  {
    label: "高级合伙人",
    value: 3,
  },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    userInfo: null,
    fluentLearnUserInfo: null,
    didShowAuth: false,
    statusHeight: 0,
    nodata: true,
    phoneNumber: "",
    existNo: undefined,
    cardBtnText: "授权登录",
    bannerList: [],
    disHasFluentLearnUserInfo: false, // 是否有畅学卡会员信息
    isFluentLearnExpired: false, // 畅学卡依然有效
    cardName: "", // 畅学卡名称
    cardDesc: "", // 畅学卡描述
    isUserHaveTeacherCard: false, // 当前用户是否有教师卡片
    teacherInfo: null
  },
  /**
   * 处理长昵称
   * @param name
   * @returns {*}
   */
  handleNickname(name) {
    return splitTargetNoString(name, 16)
  },
  /**
   * 跳转到画册
   */
  goToBooks() {
    wx.navigateTo({url: "/mine/books/books"})
  },
  /**
   * 跳转到提现页
   */
  goToConvertCashPage() {
    bxPoint("mine_finalamount", {
      mine_finalamount: $notNull(this.data.userInfo) ? this.data.userInfo.amount : 0
    }, false)
    if (!hasUserInfo() || !hasAccountInfo()) {
      return this.setData({
        didShowAuth: true
      })
    }
    wx.navigateTo({
      url: "/mine/convertCash/convertCash"
    })
  },
  /**
   * 处理广告位点击事件
   * @param e
   */
  onBannerItemTap(e) {
    let {
      link,
      link_type,
      id,
      pic_url
    } = e.currentTarget.dataset.item
    bxPoint("mine_banner", {
      mine_banner_id: id,
      mine_banner_src: pic_url,
      mine_banner_url: link,
      mine_banner_mode: link_type,
    }, false)
    if (e.currentTarget.dataset.item.need_auth === 1) {
      if (!hasUserInfo() || !hasAccountInfo()) {
        return this.setData({
          didShowAuth: true
        })
      }
    }
    if (link_type === 'youzan') {
      getYouZanAppId().then(appId => {
        wx.navigateToMiniProgram({
          appId,
          path: link
        })
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }
  },
  // 处理畅学卡按钮点击事件
  onFluentCardTap() {
    if (!hasUserInfo() || !hasAccountInfo()) {
      this.setData({didShowAuth: true})
    } else {
      if (this.data.disHasFluentLearnUserInfo && !this.data.isFluentLearnExpired) {
        wx.navigateTo({
          url: "/mine/fluentLearnInfo/fluentLearnInfo"
        })
      } else {
        bxPoint("mine_changxue_buy", {}, false)
        wx.navigateTo({
          url: "/mine/joinFluentLearn/joinFluentLearn"
        })
      }
    }
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
  // 获取用户信息
  getUserSingerInfo() {
    if (!hasUserInfo() || !hasAccountInfo()) return Promise.reject()
    return new Promise((resolve, reject) => {
      getUserInfo('scene=zhide').then(res => {
        res.amount = Number((res.amount / 100).toFixed(2))
        setLocalStorage(GLOBAL_KEY.accountInfo, res)
        res.nick_name = this.handleNickname(res.nick_name)
        this.setData({
          userInfo: res
        })

        resolve()
      }).catch((err) => {
        if (err === -2) {
          setTimeout(() => {
            this.setData({
              nodata: true,
              userInfo: null,
              cardBtnText: "授权登录",
              disHasFluentLearnUserInfo: false,
            })
          }, 1000)
          return
        }
        reject(err)
      })
    })
  },

  getBanner() {
    getFindBanner({
      scene: 18
    }).then((list) => {
      this.setData({
        bannerList: list
      })
    })
  },

  /**
   * 请求畅学卡信息
   */
  getFluentInfo() {
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    getFluentCardInfo({
      user_snow_id: accountInfo.snow_id
    }).then(({
      data
    }) => {
      if ($notNull(data)) {
        // 畅学卡是否已过期
        let isFluentLearnExpired = data.status === FluentLearnUserType.deactive

        this.setData({
          fluentLearnUserInfo: data,
          disHasFluentLearnUserInfo: !!data,
          isFluentLearnExpired,
          cardBtnText: isFluentLearnExpired ? "立即加入" : "查看权益"
        })
        this.setData({
          ['fluentLearnUserInfo.expire_time'] : this.data.fluentLearnUserInfo.expire_time.match(/\S+/)[0]
        })

      } else {
        this.setData({
          cardBtnText: "立即加入"
        })
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
    this.reloadUserCenter()
    this.init()
    this.setData({
      didShowAuth: false
    })
  },

  // 处理
  init() {
    this.setData({
      userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    })
    getFluentCardInfo({
      user_snow_id: this.data.userInfo.snow_id
    }).then(({
      data
    }) => {
      this.setData({
        disHasFluentLearnUserInfo: !!data
      })
    })
  },

  reloadUserCenter() {
    this.run()
    this.getUserSingerInfo().then(() => {
      this.getFluentInfo()
    })
    // 获取加入学习群高度，用来判断显示余额显示
    let userId = !!getLocalStorage(GLOBAL_KEY.userId)
    if (userId) {
      setTimeout(() => {
        let query = wx.createSelectorQuery();
        query.select('.function-list').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
          this.setData({
            showMoneyNoticeTop: parseInt(res[0].top) - 350,
          })
        })
      }, 500)
    }
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
  goToJoinedActivities() {
    if (hasUserInfo() && hasAccountInfo()) {
      wx.navigateTo({
        url: "/mine/joinedActivities/joinedActivities"
      })
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  goToTaskBootcampPage() {
    if (hasUserInfo() && hasAccountInfo()) {
      bxPoint("applet_mine_click_bootcamp", {}, false)
      wx.navigateTo({
        url: "/mine/personBootcamp/personBootcamp"
      })
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  goToTaskCoursePage() {
    if (hasUserInfo() && hasAccountInfo()) {
      bxPoint("applet_mine_click_course", {}, false)
      wx.navigateTo({
        url: "/mine/personCourse/personCourse"
      })
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 我的订单
  goToYouZanOrderPage() {
    wx.navigateToMiniProgram({
      appId: "wx95fb6b5dbe8739b7",
      path: "packages/trade/order/list/index"
    })
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
    this.getUserSingerInfo()
  },
  // 联系客服
  callPhone(e) {
    bxPoint("mine_contact", {}, false)
    wx.openCustomerServiceChat({
      extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc16674b49d8f7dc5f'},
      corpId: 'ww8d4cae43fb34dc92'
    })
  },
  // 跳转到分销人列表页
  goToDistributeListPage(e) {
    wx.navigateTo({
      url: `/mine/distributeRecord/distributeRecord?index=${e.currentTarget.dataset.index}`
    })
  },
  // 生成海报
  generatePoster() {
    bxPoint("mine_distributer_post", {}, false)

    if (!hasUserInfo() || !hasAccountInfo()) {
      return this.setData({
        didShowAuth: true
      })
    }

    // 04.25之前成为花样学生的用户，点击获取专属海报按钮时跳转老带新海报，反之跳转畅学卡海报页
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    // wx.navigateTo({url: "/mine/oldInviteNew/oldInviteNew?inviteId=" + accountInfo.snow_id})
    wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
    // if ($notNull(this.data.fluentLearnUserInfo)) {
    //   let createdAt = dayjs(this.data.fluentLearnUserInfo.created_at)
    //   if (createdAt.isBefore(dayjs("2021-04-25"))) {
    //     wx.navigateTo({url: "/mine/oldInviteNew/oldInviteNew?inviteId=" + accountInfo.snow_id})
    //   } else {
    //     wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
    //   }
    // } else {
    //   wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
    // }
  },
  run() {
    // 获取师资信息
    getUserPersonPageInfo()
      .then(({data}) => {
        if ($notNull(data)) {
          this.setData({teacherInfo: data})
        }

        this.setData({isUserHaveTeacherCard: $notNull(data)})
      })


    if (hasUserInfo() && !hasAccountInfo()) {
      // 有微信信息没有手机号信息
      let info = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
      info.nickname = this.handleNickname(info.nickname)
      this.setData({
        userInfo: info,
        nodata: true,
      })
    } else if (hasUserInfo() && hasAccountInfo()) {
      // 有微信信息且有手机号信息
      this.kingOfTheWorld()
      this.setData({
        nodata: false,
      })
    } else {
      // nothing
      this.setData({
        nodata: true
      })
    }

    this.calcUserCreatedTime()

    // 获取畅学卡文案
    getFluentLearnInfo().then(({
      data
    }) => {
      this.setData({
        cardName: data.card_name,
        cardDesc: data.description,
      })
    })
    // 获取加入学习群高度，用来判断显示余额显示
    let userId = !!getLocalStorage(GLOBAL_KEY.userId)
    if (userId) {
      setTimeout(() => {
        let query = wx.createSelectorQuery();
        query.select('.function-list').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
          this.setData({
            showMoneyNoticeTop: parseInt(res[0].top) - 350,
          })
        })
      }, 500)
    }

    this.setData({loading: true})
  },


  // 初始化指示图
  initIndicatePic(type = 0) {
    let sign = getLocalStorage("need_show_mine_sign")
    if (type === 0) {
      // 首次进入我的，加上标识
      if (sign === undefined) {
        setLocalStorage("need_show_mine_sign", true)
      }
    } else if (type === 1) {
      // 成为会员首次进入我的，删除标识,显示指示图
      if (sign === true) {
        // 获取加入学习群高度，用来判断显示余额显示
        this.setData({
          showMoneyNotice: true
        })
        setTimeout(() => {
          this.setData({
            showMoneyNotice: false
          })
        }, 2000)
        setLocalStorage('need_show_mine_sign', 'false')
      }
    }
  },

  // 跳转到个人主页
  goToPersonCard() {
    wx.navigateTo({
      url: `/teacherModule/index/index?id=${this.data.teacherInfo.id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getLocalStorage("need_show_mine_sign") === undefined) {
      this.initIndicatePic()
    }
    let nowTimeStr = parseInt(new Date().getTime() / 1000)
    let threeDayLaterTimeStr = getLocalStorage('hy_daxue_show_club_vip_alert_sign')
    if (threeDayLaterTimeStr && nowTimeStr > threeDayLaterTimeStr) {
      wx.removeStorageSync('hy_daxue_show_club_vip_alert_sign')
    }
    let data = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    this.setData({
      statusHeight: data,
    })
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
        selected: 1
      })
    }
    this.calcUserCreatedTime()
    bxPoint("applets_mine", {})
    this.getBanner()
    this.getNumber()
    this.setData({
      showMoneyNotice: false
    })

    if (hasAccountInfo() && hasUserInfo()) {
      // 每次访问个人中心更新最新的账户数据和畅学卡信息
      this.init()
      this.getUserSingerInfo().then(() => {
        this.getFluentInfo()
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
      title: '在花样百姓，过积极、健康、时尚的品质生活',
      path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  },
  onPageScroll(res) {
    let userId = !!getLocalStorage(GLOBAL_KEY.userId)
    let distribute_user = this.data.partnerInfo
    if (userId && distribute_user && distribute_user.distribute_user && distribute_user.distribute_user.status === 2 && res.scrollTop > this.data.showMoneyNoticeTop) {
      this.initIndicatePic(1)
    }
  }
})
