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
        // item.title = item.title.substring(0, 18)
        item.url = item.cover_url
      })
      preloadNetworkImg(list).then(res => {
        let leftHeight = Number(this.data.leftListHeight)
        let rightHeight = Number(this.data.rightListHeight)
        let leftList = this.data.leftList.concat([])
        let rightList = this.data.rightList.concat([])
        let commonHeight = parseInt(((JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).windowWidth) / 375) * 89) - 2
        res.map(item => {
          item.view_count = item.view_count > 9999 ? (Math.floor(item.view_count / 1000) / 10) + '万' : item.view_count
          if (leftHeight <= rightHeight) {
            leftList.push(item)
            leftHeight = leftHeight + commonHeight + Number(item.maxHeight)
            // leftHeight = leftHeight + Number(item.maxHeight)
          } else {
            rightList.push(item)
            rightHeight = rightHeight + commonHeight + Number(item.maxHeight)
            // rightHeight = rightHeight + Number(item.maxHeight)
          }
          this.setData({
            rightList,
            leftList,
            leftListHeight: leftHeight,
            rightListHeight: rightHeight
          })
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