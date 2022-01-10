import bxPoint from "../../utils/bxPoint"
import { $notNull, getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getModelDataList, getVideoTypeList, queryVideoCourseListByBuyTag } from "../../api/course/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: -1,
    currentTagName: "",
    pageSize: {
      limit: 10,
      offset: 0
    },
    videoList: [],
    bottomLock: true,
    structuredPageSize: {
      limit: 10,
      offset: 0
    }, // 结构化课程分页器
    structuredList: [], // 结构化课程数据
    noMoreStructureData: false, // 是否还有更多结构化课程数据

    tabsOffsetTop: 0, // Tabs距离顶部的数字
    pageScrollLock: false, // 页面滑动记录锁
    didShowFixedTabsLayout: false, // 是否需要固定Tabs到顶部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.run()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  onPageScroll({scrollTop}) {
    if (this.data.pageScrollLock) return
    this.setData({pageScrollLock: true})
    let t = setTimeout(() => {
      this.setData({didShowFixedTabsLayout: scrollTop >= this.data.tabsOffsetTop, pageScrollLock: false})
      clearTimeout(t)
    }, 50)
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
    if (this.data.bottomLock) {
      this.getVideoList(this.data.currentIndex, false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 启动函数
  run() {
    this.getTabList(0)
  },
  // 跳往视频课程详情页
  toVideoCourseDetail(e) {
    let self = this
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`,
      complete() {
        bxPoint("series_details", {
          series_id: item.id,
          kecheng_name: item.teacher_desc,
          kecheng_subname: item.name,
          kecheng_total_amount: item.visit_count,
          kecheng_ori_price: item.price,
          kecheng_dis_price: item.discount_price,
          kecheng_teacher: item.teacher.name,
        }, false)
      }
    })
  },
  onStructureItemTap(e) {
    let self = this
    wx.navigateTo({
      url: "/subCourse/practiceDetail/practiceDetail?courseId=" + e.currentTarget.dataset.id,
    })
  },
  // 获取课程列表
  getVideoList(index, refresh = true) {
    let category = ''
    category = this.data.keyArr[index]
    let params = {
      offset: this.data.pageSize.offset,
      limit: this.data.pageSize.limit,
      category
    }

    // 模特训练，加载所有数据
    if (this.currentTagName === "模特训练") {
      params.offset = 0
      params.limit = 9999
    }

    if (getLocalStorage(GLOBAL_KEY.userId)) {
      params.user_id = getLocalStorage(GLOBAL_KEY.userId)
    }
    queryVideoCourseListByBuyTag(params).then(list => {
      list = list || []
      list = list.map(_ => {
        return {
          ..._.kecheng_series,
          teacher: _.teacher,
          didBought: _.buy_tag === "已购",
          buy_tag: _.buy_tag
        }
      })
      let bottomLock = true
      if (list.length < 10) {
        bottomLock = false
      }
      let handledList = list.map((res) => {
        if (res.visit_count >= 10000) {
          res.visit_count = (res.visit_count / 10000).toFixed(1) + "万"
          res.visit_count = res.visit_count.split('.')[1] === '0万' ? res.visit_count[0] + "万" : res.visit_count
        }
        res.price = (res.price / 100) // .toFixed(2)
        if (res.discount_price === -1 && res.price > 0) {
          // 原价出售
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.price * res.invite_discount / 10000) // .toFixed(2)
          }
        } else if (res.discount_price >= 0 && res.price > 0) {
          // 收费但有折扣
          res.discount_price = (res.discount_price / 100) // .toFixed(2)
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.discount_price * res.invite_discount / 10000) // .toFixed(2)
          }
        } else if (+res.discount_price === -1 && +res.price === 0) {
          res.discount_price = 0
        }

        // 只显示开启营销活动的数据
        if (+res.invite_open === 1 && (res.price > 0 || res.discount_price > 0)) {
          res.tipsText = res.fission_price == 0 ? "邀好友免费学" : `邀好友${(res.invite_discount / 10)}折购`
        }

        return res
      })
      if (refresh || this.data.currentTagName === "模特训练") {
        handledList = [...handledList]
      } else {
        handledList = this.data.videoList.concat(handledList)
      }
      this.setData({
        videoList: handledList,
        bottomLock: bottomLock,
        pageSize: {
          offset: this.data.pageSize.offset + this.data.pageSize.limit,
          limit: this.data.pageSize.limit
        }
      })
    })
  },
  // 获取tab列表
  getTabList(index) {
    getVideoTypeList().then(res => {
      let arr = []
      let keyArr = []
      for (let i in res) {
        arr.push(res[i].value)
        keyArr.push(res[i].key)
      }
      this.setData({titleList: arr, keyArr: keyArr})
      this.changeTab({index, tagname: arr[index]})
      if (this.data.didFromDiscovery && this.data.tabsOffsetTop !== 0) {
        this.setData({didFromDiscovery: false})
        getApp().globalData.discoveryToPracticeTabIndex = undefined
        wx.pageScrollTo({selector: "#practice-page", scrollTop: this.data.tabsOffsetTop, duration: 400})
      }
    })
  },
  // 切换tab
  changeTab(e) {
    let index = ""
    let tagName = ""
    if ($notNull(e)) {
      if (e.currentTarget) {
        index = e.currentTarget.dataset.index
        tagName = e.currentTarget.dataset.tagname
      } else {
        index = e.index
        tagName = e.tagname
      }

      // 学校课程页内部切换tab，不重新请求数据
      // if (!this.data.didFromDiscovery && (+index === +this.data.currentIndex)) return

      this.setData({currentIndex: index, currentTagName: tagName})
    } else {
      index = 0
    }

    this.setData({
      videoList: [],
      structuredList: [],
      pageSize: {offset: 0, limit: 10},
      structuredPageSize: {offset: 0, limit: 10}
    })

    // 设置页面位置
    if (this.data.didShowFixedTabsLayout) {
      wx.pageScrollTo({
        selector: "#practice-page",
        duration: 200,
        scrollTop: this.data.tabsOffsetTop
      })
    }

    if (this.data.currentTagName === "模特训练") {
      // 模特训练，底部填充结构化课程（含分页功能）
      this.getModelStructureList()
    }
    this.getVideoList(index)

    // 打点
    bxPoint("series_tab_button", {tab_tag: this.data.titleList[index]}, false)
  },
  // 获取模特结构化动作列表
  getModelStructureList() {
    getModelDataList({
      kecheng_type: 3,
      offset: this.data.structuredPageSize.offset,
      limit: this.data.structuredPageSize.limit
    })
      .then(({data: list}) => {
        if (list.length < this.data.structuredPageSize.limit) this.setData({noMoreStructureData: true})
        this.setData({
          structuredList: [...this.data.structuredList, ...list],
          structuredPageSize: {
            offset: this.data.structuredPageSize.offset + list.length,
            limit: this.data.structuredPageSize.limit
          }
        })
      })
  },
})
