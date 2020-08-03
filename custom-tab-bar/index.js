Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        "pagePath": "/pages/discovery/discovery",
        "selectedIconPath": "../assets/images/common/liveActive.png",
        "iconPath": "../assets/images/common/live.png",
        "text": "发现",
        isDIY: false
      },
      {
        "pagePath": "/pages/practice/practice",
        "selectedIconPath": "../assets/images/common/mallActive.png",
        "iconPath": "../assets/images/common/mall.png",
        "text": "练习",
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
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
    }
  }
})
