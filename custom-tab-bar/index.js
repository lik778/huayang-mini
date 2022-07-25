import bxPoint from "../utils/bxPoint"

Component({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#FE5141",
    list: [{
        "pagePath": "/pages/discovery/discovery",
        "selectedIconPath": "../assets/images/common/homeActive.png",
        "iconPath": "../assets/images/common/home.png",
        "text": "首页",
      },
			{
				"pagePath": "/pages/mindfulnessList/mindfulnessList",
				"selectedIconPath": "../assets/images/common/mindfulness.png",
				"iconPath": "../assets/images/common/mindfulness.png",
				"text": "正念练习",
			},
      {
        "pagePath": "/pages/userCenter/userCenter",
        "selectedIconPath": "../assets/images/common/mineActive.png",
        "iconPath": "../assets/images/common/mine.png",
        "text": "我的",
      }
    ],
  },
  attached() {},
  created() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path

			// 首页
			if (this.data.selected === 0 && url === '/pages/mindfulnessList/mindfulnessList') {
				bxPoint("homepage_mindfulness_visit", {}, false)
			} else if (this.data.selected === 0 && url === '/pages/userCenter/userCenter') {
				bxPoint("homepage_mine_visit", {}, false)
			}

			// 正念练习
			else if (this.data.selected === 1 && url === '/pages/discovery/discovery') {
				bxPoint("mindfulness_homepage_visit", {}, false)
			} else if (this.data.selected === 1 && url === '/pages/userCenter/userCenter') {
				bxPoint("mindfulness_mine_visit", {}, false)
			}

			// 我的
			else if (this.data.selected === 2 && url === '/pages/discovery/discovery') {
				bxPoint("mine_homepage_visit", {}, false)
			} else if (this.data.selected === 2 && url === '/pages/mindfulnessList/mindfulnessList') {
				bxPoint("mine_mindfulness_visit", {}, false)
			}

      wx.switchTab({url})
    }
  }
})
