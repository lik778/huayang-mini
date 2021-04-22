// components/clubVipAlert/clubVipAlert.js
import baseUrl from "../../lib/request"
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    type: {
      type: Number,
      value: 1, //1为会员注册,2为购买学生卡
    },
    link: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showCloseAnimation: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 立即加入
    join() {
      let rootUrl = baseUrl.baseUrl
      let userId = getLocalStorage(GLOBAL_KEY.userId)
      // let link = encodeURIComponent(`${rootUrl}/#/home/huayangClubForm?id=${userId}&from=daxue`)
      let link = this.data.link
      this.triggerEvent("closeClubVipAlert")
      wx.navigateTo({
        url: `/subCourse/noAuthWebview/noAuthWebview?link=${link}`,
      })
    },
    // 关闭
    close() {
      this.setData({
        showCloseAnimation: false
      })
      setTimeout(() => {
        this.triggerEvent("closeClubVipAlert")
      }, 300)
    }
  }
})