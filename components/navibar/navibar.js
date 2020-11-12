// components/navibar.js
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
    title: {
      type: String
    },
    titleColor: {
      type: String,
      value: "black"
    },
    color: {
      type: String,
      value: ""
    },
    forceGoBackIndex: {
      type: Boolean,
      value: false
    },
    forceGoBackPath: {
      type: String,
      value: ""
    },
    backPath: {
      type: String,
      value: ""
    },
    backPathBelongTab: {
      type: Boolean,
      value: false
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
      } else if (this.data.backPath) {
        if (this.data.backPathBelongTab) {
          wx.switchTab({
            url: this.data.backPath,
          })
        } else {
          wx.navigateBack({
            delta: 1
          });
        }
      } else {
        wx.navigateBack({
          delta: 1
        });
      }
    },
    // 返回首页
    backIndex() {
      if (this.data.forceGoBackPath) {
        wx.switchTab({
          url: this.data.forceGoBackPath
        })
      } else {
        wx.switchTab({
          url: '/pages/discovery/discovery',
        })
      }
    }
  },
  attached() {
    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
  }
})