import bxPoint from "../utils/bxPoint"

Component({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#FF5544",
    list: [{
        "pagePath": "/pages/discovery/discovery",
        "selectedIconPath": "../assets/images/common/homeActive.png",
        "iconPath": "../assets/images/common/home.png",
        "text": "首页",
      },
      {
        "pagePath": "/pages/competition/competition",
        "selectedIconPath": "../assets/images/common/competitionActive.png",
        "iconPath": "../assets/images/common/competition.png",
        "text": "大赛",
      },
      {
        "pagePath": "/pages/practice/practice",
        "selectedIconPath": "../assets/images/common/practiceActive.png",
        "iconPath": "../assets/images/common/practice.png",
        "text": "课程",
      },
      {
        "pagePath": "/pages/userCenter/userCenter",
        "selectedIconPath": "../assets/images/common/mineActive.png",
        "iconPath": "../assets/images/common/mine.png",
        "text": "我的",
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path

      // 首页TAB
      if (this.data.selected === 0 && url === '/pages/practice/practice') {
        bxPoint("homepage_series", {}, false)
      } else if (this.data.selected === 0 && url === '/pages/studentMoments/studentMoments') {
        bxPoint("homepage_bbs", {}, false)
      } else if (this.data.selected === 0 && url === '/pages/userCenter/userCenter') {
        bxPoint("homepage_mine_visit", {}, false)
      }

      // 大赛TAB
      else if (this.data.selected === 1 && url === '/pages/discovery/discovery') {
        bxPoint("bbs_homepage", {}, false)
      } else if (this.data.selected === 1 && url === '/pages/practice/practice') {
        bxPoint("bbs_series", {}, false)
      } else if (this.data.selected === 1 && url === '/pages/userCenter/userCenter') {
        bxPoint("bbs_mine", {}, false)
      }

      // 学校课程TAB
      else if (this.data.selected === 2 && url === '/pages/discovery/discovery') {
        bxPoint("series_homepage_visit", {}, false)
      } else if (this.data.selected === 2 && url === '/pages/studentMoments/studentMoments') {
        bxPoint("series_bbs", {}, false)
      } else if (this.data.selected === 2 && url === '/pages/userCenter/userCenter') {
        bxPoint("series_mine_visit", {}, false)
      }

      // 我的TAB
      else if (this.data.selected === 3 && url === '/pages/discovery/discovery') {
        bxPoint("applets_mine_homepage", {}, false)
      } else if (this.data.selected === 3 && url === '/pages/studentMoments/studentMoments') {
        bxPoint("applets_mine_bbs", {}, false)
      } else if (this.data.selected === 3 && url === '/pages/practice/practice') {
        bxPoint("applets_mine_series", {}, false)
      }

      wx.switchTab({
        url
      })
    }
  }
})
