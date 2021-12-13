import bxPoint from "../utils/bxPoint"
import { getYouZanHomeLink } from "../api/life/index";

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
        "pagePath": "/pages/userCenter/userCenter",
        "selectedIconPath": "../assets/images/common/mineActive.png",
        "iconPath": "../assets/images/common/mine.png",
        "text": "我的",
      }
    ],
    youZanHomeLink: ""
  },
  attached() {},
  created() {
    // getYouZanHomeLink().then((link) => {
    //   this.setData({youZanHomeLink: link})
    // })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path

      // 首页TAB
      if (this.data.selected === 0 && url === '/pages/userCenter/userCenter') {
        bxPoint("homepage_mine_visit", {}, false)
      }

      // 我的TAB
      else if (this.data.selected === 1 && url === '/pages/discovery/discovery') {
        bxPoint("minepage_home_visit", {}, false)
      }

      wx.switchTab({url})
    }
  }
})
