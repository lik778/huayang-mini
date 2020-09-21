import { checkFissionTaskStatus, getFissionDetail, queryFissionList, unlockFissionTask } from "../../api/course/index"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, toast } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    didShowUnlockAlert: false,
    didHelped: false, // 当前用户是否已助过力
    seriesInviteId: 0, // 助力邀请ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let {series_invite_id = ''} = options

    // 是否帮别人助力
    if (series_invite_id) {

      let {kecheng_series_invite: taskInfo = {}} = await getFissionDetail({series_invite_id})
      let userOpenId = getLocalStorage(GLOBAL_KEY.openId)

      // 助力任务的发起人不能是助力人
      if (taskInfo.open_id === userOpenId) return

      checkFissionTaskStatus({
        open_id: userOpenId,
        invite_id: series_invite_id
      }).then((result) => {
        // 没数据说明未帮该好友助力，展示助力弹窗
        if (!$notNull(result)) {
          this.setData({ didShowUnlockAlert: true, seriesInviteId: series_invite_id })
        } else {
          this.setData({ didShowUnlockAlert: true, seriesInviteId: series_invite_id, didHelped: true })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.queryList()
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

  },
  // 授权弹窗确认回调
  authCompleteEvent() {
    this.setData({didShowAuth: false})
    // this.handlerHelp()
  },
  // 授权弹窗取消回调
  authCancelEvent() {
    this.setData({didShowAuth: false})
  },
  // 跳转至对应课程
  jumpToCourseDetail(e) {
    let {id} = e.currentTarget.dataset.item

    wx.navigateTo({
      url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
    })
  },
  queryList() {
    queryFissionList({limit: 100}).then((list) => {
      let handledList = list.filter((res) => {
        if (res.discount_price === -1 && res.price > 0) {
          // 原价出售
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.price * res.invite_discount / 10000).toFixed(2)
          }
        } else if (res.discount_price > 0 && res.price > 0) {
          // 收费但有折扣
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.discount_price * res.invite_discount / 10000).toFixed(2)
          }
        }

        // 只显示开启营销活动的数据
        if (+res.invite_open === 1) {
          return res
        }
      })
      this.setData({list: handledList})
    })
  },
  handlerHelp() {
    // 检查权限
    if (!(hasAccountInfo() && hasUserInfo())) {
      this.setData({didShowAuth: true})
      return
    }

    if (!this.data.didHelped) {
      // 助力解锁
      unlockFissionTask({
        open_id: getLocalStorage(GLOBAL_KEY.openId),
        user_id: getLocalStorage(GLOBAL_KEY.userId),
        invite_id: this.data.seriesInviteId
      }).then(() => {
        toast('助力成功', 1000)
      })
    }
    this.setData({didShowUnlockAlert: false})

  }
})
