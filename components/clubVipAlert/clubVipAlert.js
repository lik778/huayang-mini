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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 立即加入
    join() {
      let rootUrl = baseUrl.baseUrl
      let userId = getLocalStorage(GLOBAL_KEY.userId)
      let link = encodeURIComponent(`${rootUrl}/#/home/huayangClubForm?id=${userId}`)
      this.triggerEvent("closeClubVipAlert")
      wx.navigateTo({
        url: `/pages/commonWebview/commonWebview?link=${link}`,
      })
    },
    // 关闭
    close() {
      this.triggerEvent("closeClubVipAlert")
    }
  }
})