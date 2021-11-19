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
        "pagePath": "/pages/life/life",
        "selectedIconPath": "../assets/images/common/shopGroundActive.png",
        "iconPath": "../assets/images/common/shopGround.png",
        "text": "严选",
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
      if (this.data.selected === 0 && url === '/pages/life/life') {
        bxPoint("homepage_bottom_tab_click", {homepage_bottom_tab_id: 1}, false)
      } else if (this.data.selected === 0 && url === 'pages/competition/competition') {
        bxPoint("homepage_bottom_tab_click", {homepage_bottom_tab_id: 2}, false)
      } else if (this.data.selected === 0 && url === '/pages/practice/practice') {
        bxPoint("homepage_bottom_tab_click", {homepage_bottom_tab_id: 3}, false)
      } else if (this.data.selected === 0 && url === '/pages/userCenter/userCenter') {
        bxPoint("homepage_bottom_tab_click", {homepage_bottom_tab_id: 4}, false)
      }

      // 大赛TAB
      else if (this.data.selected === 2 && url === '/pages/discovery/discovery') {
        bxPoint("show_bottom_tab_click", {show_bottom_tab_id : 1}, false)
      } else if (this.data.selected === 2 && url === 'pages/life/life') {
        bxPoint("show_bottom_tab_click", {show_bottom_tab_id : 2}, false)
      } else if (this.data.selected === 2 && url === '/pages/practice/practice') {
        bxPoint("show_bottom_tab_click", {show_bottom_tab_id : 3}, false)
      } else if (this.data.selected === 2 && url === '/pages/userCenter/userCenter') {
        bxPoint("show_bottom_tab_click", {show_bottom_tab_id : 4}, false)
      }

      // 学校课程TAB
      else if (this.data.selected === 3 && url === '/pages/discovery/discovery') {
        bxPoint("series_bottom_tab_click", {series_bottom_tab_id : 1}, false)
      } else if (this.data.selected === 3 && url === 'pages/life/life') {
        bxPoint("series_bottom_tab_click", {series_bottom_tab_id : 2}, false)
      } else if (this.data.selected === 3 && url === '/pages/competition/competition') {
        bxPoint("series_bottom_tab_click", {series_bottom_tab_id : 3}, false)
      } else if (this.data.selected === 3 && url === '/pages/userCenter/userCenter') {
        bxPoint("series_bottom_tab_click", {series_bottom_tab_id : 4}, false)
      }

      // 我的TAB
      else if (this.data.selected === 4 && url === '/pages/discovery/discovery') {
        bxPoint("mine_bottom_tab_click", {mine_bottom_tab_id : 1}, false)
      } else if (this.data.selected === 4 && url === 'pages/life/life') {
        bxPoint("mine_bottom_tab_click", {mine_bottom_tab_id : 2}, false)
      } else if (this.data.selected === 4 && url === '/pages/competition/competition') {
        bxPoint("mine_bottom_tab_click", {mine_bottom_tab_id : 3}, false)
      } else if (this.data.selected === 4 && url === '/pages/practice/practice') {
        bxPoint("mine_bottom_tab_click", {mine_bottom_tab_id : 4}, false)
      }

      if (data.index === 1) {
        // 跳转到有赞严选
        wx.navigateToMiniProgram({
          appId: "wx95fb6b5dbe8739b7",
          path: "pages/common/blank-page/index",
          success() {
            bxPoint("lifemall_youzan_tab_click", {}, false)
          },
          fail() {
            bxPoint("lifemall_youzan_tab_agreement_click", {}, false)
          }
        })
      } else {
        wx.switchTab({url})
      }
    }
  }
})
