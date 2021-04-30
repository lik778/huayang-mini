Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: {type: String},
    confirmText: {type: String, value: "确定"},
    show: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (newVal) {
          this.setData({
            didVisible: newVal
          })
        } else {
          let timer = setTimeout(() => {
            this.setData({
              didVisible: newVal
            })
            clearTimeout(timer)
          }, 200)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    didVisible: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirm() {
      this.triggerEvent("confirm")
    },
    close() {
      this.triggerEvent("close")
    }
  }
})
