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
        "text": "首页",
        isDIY: false
      },
      {
        "pagePath": "/pages/studentMoments/studentMoments",
        "selectedIconPath": "../assets/images/common/student-moments-active.png",
        "iconPath": "../assets/images/common/student-moments.png",
        "text": "校友动态",
        isDIY: false
      },
      {
        "pagePath": "/pages/practice/practice",
        "selectedIconPath": "../assets/images/common/practiceActive.png",
        "iconPath": "../assets/images/common/practice.png",
        "text": "课程",
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

      if (this.data.selected === 0 && url === '/pages/practice/practice') {
        bxPoint("homepage_series_visit", {}, false)
      } else if (this.data.selected === 0 && url === '/pages/userCenter/userCenter') {
        bxPoint("homepage_mine_visit", {}, false)
      } else if (this.data.selected === 1 && url === '/pages/discovery/discovery') {
        bxPoint("series_homepage_visit", {}, false)
      } else if (this.data.selected === 1 && url === '/pages/userCenter/userCenter') {
        bxPoint("series_mine_visit", {}, false)
      } else if (this.data.selected === 2 && url === '/pages/discovery/discovery') {
        // jj-2021-03-12梨花
        bxPoint("applets_mine_homepage", {}, false)
      } else if (this.data.selected === 2 && url === '/pages/practice/practice') {
        // jj-2021-03-12梨花
        bxPoint("applets_mine_series", {}, false)
      }

      wx.switchTab({
        url
      })
    }
  }
})