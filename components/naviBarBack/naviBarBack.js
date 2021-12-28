// components/naviBarBack/naviBarBack.js
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showType: {
      type: Number,
      value: 3
    },
    backPath: {
      type: String,
      value: ''
    },
    isRootBar: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    titleColor: {
      type: String,
      value: '#000'
    },
    navibarBgColor: {
      type: String,
      value: '#fff'
    },
    needRedirect: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    backIconLucency: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1640591977rsDEZS.jpg",
    statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 返回 */
    back() {
      // if (getCurrentPages().length === 1) {
      //   wx.switchTab({
      //     url: '/pages/discovery/discovery',
      //   })
      //   return
      // }
      if (this.data.isRootBar) {
        if (this.data.backPath) {
          wx.switchTab({
            url: this.data.backPath,
          })
        } else {
          wx.navigateBack()
        }
      } else {
        if (this.data.backPath) {
          if (this.data.needRedirect) {
            wx.reLaunch({
              url: this.data.backPath,
            })
          } else {
            wx.navigateTo({
              url: this.data.backPath,
            })
          }
        } else {
          wx.navigateBack()
        }
      }
    }
  }
})