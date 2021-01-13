import bxPoint from "../utils/bxPoint"
Component({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#CC0000",
    list: [{
        "pagePath": "/pages/discovery/discovery",
        "selectedIconPath": "../assets/images/common/homeActive.png",
        "iconPath": "../assets/images/common/home.png",
        "text": "发现",
        isDIY: false
      },
      {
        "pagePath": "/pages/practice/practice",
        "selectedIconPath": "../assets/images/common/practiceActive.png",
        "iconPath": "../assets/images/common/practice.png",
        "text": "学习",
        isDIY: false
      },
      {
        "pagePath": "/pages/userCenter/userCenter",
        "selectedIconPath": "../assets/images/common/mineActive.png",
        "iconPath": "../assets/images/common/mine.png",
        "text": "我的",
        isDIY: false
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      if (url === '/pages/discovery/discovery') {
        // 发现页
        bxPoint("applets_find_click", {
          from_uid: getApp().globalData.super_user_id
        }, false)
      } else if (url === '/pages/practice/practice') {
        // 学习页
        bxPoint("applets_study_click", {
          from_uid: getApp().globalData.super_user_id
        }, false)
      } else if (url === '/pages/userCenter/userCenter') {
        // 我的页
        bxPoint("applets_mine_click", {
          from_uid: getApp().globalData.super_user_id
        }, false)
      }
    }
  }
})