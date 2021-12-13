// components/waterfall/waterfall.js
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage,
  preloadNetworkImg
} from "../../utils/util"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    refresh: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1638840810BLFBaV.jpg",
    visitIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1638840893RreULx.jpg",
    leftListHeight: 0,
    rightListHeight: 0,
    leftList: [],
    rightList: [],
    refreshStatus: false,
  },

  observers: {
    "list": function (newVal) {
      this.manageListData(newVal)
    },
    "refresh": function (newVal) {
      this.setData({
        refreshStatus: newVal
      })
    }
  },

  lifetimes: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /* 初始化瀑布流数据 */
    manageListData(list) {
      // let list = this.data.list
      if (this.data.refreshStatus) {
        this.setData({
          leftListHeight: 0,
          rightListHeight: 0,
          leftList: [],
          rightList: []
        })
      }
      if (list.length === 0) {
        wx.hideLoading()
      }
      list.map(item => {
        item.url = item.cover_url
      })
      preloadNetworkImg(list).then(res => {
        res.map(item => {
          if (this.data.leftListHeight <= this.data.rightListHeight) {
            let leftListOld = this.data.leftList.concat([])
            leftListOld.push(item)
            this.setData({
              leftList: leftListOld,
              leftListHeight: Number(this.data.leftListHeight) + Number(item.maxHeight)
            })
          } else {
            let rightListOld = this.data.rightList.concat([])
            rightListOld.push(item)
            this.setData({
              rightList: rightListOld,
              rightListHeight: Number(this.data.rightListHeight) + Number(item.maxHeight)
            })
          }
          wx.hideLoading()
        })
      })
    },
    /* 跳转详情 */
    toDetail(e) {
      let item = e.currentTarget.dataset.item
      this.triggerEvent("clickItem", {
        item
      })
    },
  }
})