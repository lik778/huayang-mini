// components/navibar.js
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    titleColor: {
      type: String,
      default: "black"
    },
    color: {
      type: String,
      default: ""
    },
    forceGoBackIndex: {
      type: Boolean,
      default: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0,
    color: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回
    back() {
      if (this.data.forceGoBackIndex) {
        this.backIndex()
      } else {
        wx.navigateBack({
          delta: 1
        });
      }
    },
    // 返回首页
    backIndex() {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
  },
  attached() {
    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
  }
})
