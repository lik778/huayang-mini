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
    share:{
      type:Boolean,
      default:true
    },
    color:{
      type:String,
      default:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0,
    color:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回
    back() {
      if (this.data.share) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.navigateBack({
          delta: 1
        });
      }
    },
    // 返回首页
    backIndex() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  attached() {
    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
    console.log(this.data.statusBarHeight)
  }
})
