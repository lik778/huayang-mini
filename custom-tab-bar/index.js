Component({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#CC0000",
    list: [
      {
        "pagePath": "/pages/discovery/discovery",
        "selectedIconPath": "../assets/images/common/homeActive.png",
        "iconPath": "../assets/images/common/home.png",
        "text": "首页",
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
