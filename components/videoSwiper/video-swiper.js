// components/videoSwiper/video-swiper.js
import bxPoint from "../../utils/bxPoint"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {}
    },
    currentVideoIndex: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    countDownIconList: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1629940855ZSqKBI.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1629940837EpoWYm.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1629940818YNUgNl.jpg'],
    swiperDotList: [1, 2, 1, 1, 0],
    countDownCurrentIndex: 0,
    showCountDown: false,
    playingVideo: false,
    direction: 'left',
    swiperDotIsEnd: false,
    animationingStatus: false,
    swiperPlayDuration: 0,
    videoLoading: true,
    videoTotalDuration: ''
  },

  lifetimes: {
    attached() {
      this.playVideoCommon(1)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 滑动swiper */
    changeSwiperCurrentIndex(e) {
      let index = e.detail.current
      if (this.videoContext) {
        this.videoContext.stop()
      }
      if (index >= this.data.currentVideoIndex) {
        /* 左滑 */
        this.manageSwiperDotActive1(index, 1)
        /* 头部视频内容主动滑动打点 */
        bxPoint("new_homepage_header_vedio_slide", {
          header_vedio_id: this.data.videoList[Number(e.detail.currentItemId) - 1].id,
          header_vedio_play_duration: this.data.swiperPlayDuration,
          header_vedio_duration: this.data.videoTotalDuration
        }, false)
      } else {
        /* 右滑 */
        this.manageSwiperDotActive1(index, -1)
        /* 头部视频内容主动滑动打点 */
        bxPoint("new_homepage_header_vedio_slide", {
          header_vedio_id: this.data.videoList[Number(e.detail.currentItemId) + 1].id,
          header_vedio_play_duration: this.data.swiperPlayDuration,
          header_vedio_duration: this.data.videoTotalDuration
        }, false)
      }

      let videoTotal = this.data.videoList.length
      let current = index + 1
      if (videoTotal - current <= 5) {
        this.triggerEvent("queryNextList")
      }

      this.setData({
        currentVideoIndex: index,
        videoTotalDuration: '',
        videoLoading: true
      })
      this.playVideoCommon(index)
    },

    /* 记录视频播放时长 */
    swiperVideoUpdate(e) {
      this.setData({
        swiperPlayDuration: Math.round(e.detail.currentTime),
        videoLoading: false,
        videoTotalDuration: parseInt(e.detail.duration)
      })
    },

    /* swiper指示点动画 */
    swiperDotAnimation(e) {
      if (e === 1) {
        this.setData({
          direction: 'left'
        })
      } else {
        this.setData({
          direction: 'right'
        })
      }
    },

    /* 统一播放视频 */
    playVideoCommon(index) {
      this.videoContext = wx.createVideoContext(`swiper-video-${index}`, this)
      this.setData({
        playingVideo: true
      }, () => {
        setTimeout(() => {
          this.videoContext.play()
        }, 200)
      })
    },

    observers: {
      'videoList'(item1, item2) {
        console.log(item1, item2)
      }
    },

    /* 指示器动画开始 */
    animationing() {
      this.setData({
        animationingStatus: true
      })
    },

    /* 指示器动画结束 */
    animationend() {
      this.setData({
        direction: '',
        animationingStatus: false
      })
    },

    /* 点击按钮播放视频 */
    playVideo(e) {
      let index = e.currentTarget.dataset.index
      this.playVideoCommon(index)
    },

    /* 视频元数据加载完成 */
    videoLoadingEnd() {
      this.setData({
        videoLoading: false
      })
    },

    /* 显示视频loading */
    showLoading() {
      this.setData({
        videoLoading: true
      })
    },

    /* 当前视频播放完成 */
    async videoEnd(e) {
      let index = this.data.currentVideoIndex + 1
      if (index >= this.data.videoList.length) {
        this.setData({
          playingVideo: false
        })
        return
      }
      await this.manageCountDown()
      this.setData({
        currentVideoIndex: index
      })
    },

    /* 管理是否需要显示下个视频提示 */
    manageCountDown() {
      return new Promise(resolve => {
        let showCountDown = this.getLocalStorage("showCountDown") ? false : true
        if (showCountDown) {
          this.setLocalStorage("showCountDown", new Date().getTime())
          this.setData({
            showCountDown: true,
          })
          let timer = setInterval(() => {
            if (this.data.countDownCurrentIndex >= 2) {
              clearInterval(timer)
              this.setData({
                showCountDown: false
              })
              resolve()
            }
            this.setData({
              countDownCurrentIndex: this.data.countDownCurrentIndex + 1
            })
          }, 1000)
        } else {
          resolve()
        }
      })

    },

    /* 暂停视频 */
    pauseVideo() {
      if (!this.data.playingVideo) {
        return
      }
      this.videoContext.pause()
      setTimeout(() => {
        this.triggerEvent('pauseVideo', true)
      }, 1000)
      this.setData({
        playingVideo: false
      })
    },

    pauseVideoAuto() {
      this.setData({
        playingVideo: false
      })
    },

    manageSwiperDotActive1(index, e1) {
      let direction = e1 === 1 ? "left" : 'right'
      let videoTotal = this.data.videoList.length
      let currentActive = this.data.swiperDotList.indexOf(2)
      let list = this.data.swiperDotList
      let dotList = []
      // dotList数组中数字0代表小指示点，1是灰大指示点，2是黑指示点
      if (videoTotal <= 5) {
        dotList = new Array(5).fill(1)
        dotList.splice(index, 1, 2)
      } else {
        if (direction === 'left') {
          if (currentActive < 3) {
            let temp = list[currentActive];
            list[currentActive] = list[currentActive + 1];
            list[currentActive + 1] = temp;
            dotList = list
          } else {
            if (index === 0) {
              dotList = [2, 1, 1, 1, 0]
            } else if (index === 1) {
              dotList = [1, 2, 1, 1, 0]
            } else if (index === 2) {
              dotList = [1, 1, 2, 1, 0]
            } else if (index === 3) {
              dotList = [1, 1, 1, 2, 0]
            } else if (index > 3) {
              if (index + 2 >= videoTotal) {
                if (index + 2 === videoTotal) {
                  dotList = [0, 1, 1, 2, 1]
                } else if (index + 1 === videoTotal) {
                  dotList = [0, 1, 1, 1, 2]
                }
              } else {
                this.swiperDotAnimation(e1)
                dotList = [0, 1, 1, 2, 0]
              }
            }
          }
        } else {
          if (currentActive > 1) {
            let temp = list[currentActive];
            list[currentActive] = list[currentActive - 1];
            list[currentActive - 1] = temp;
            dotList = list
          } else {
            if (index + 1 === videoTotal) {
              dotList = [0, 1, 1, 1, 2]
            } else if (index + 2 === videoTotal) {
              dotList = [0, 1, 1, 2, 1]
            } else if (index + 3 === videoTotal) {
              dotList = [0, 1, 2, 1, 1]
            } else if (index + 4 === videoTotal) {
              if (index > 1) {
                dotList = [0, 2, 1, 1, 1]
              } else {
                dotList = [1, 2, 1, 1, 1]
              }
            } else if (index + 4 < videoTotal) {
              if (index === 0) {
                dotList = [2, 1, 1, 1, 0]
              } else if (index === 1) {
                dotList = [1, 2, 1, 1, 0]
              } else {
                dotList = [0, 2, 1, 1, 0]
                this.swiperDotAnimation(e1)
              }
            }
          }

        }
      }
      this.setData({
        swiperDotList: dotList
      })
    },

    /* 获取缓存 */
    getLocalStorage(key, noParse = false) {
      try {
        let value = wx.getStorageSync(key)
        return value ? (noParse ? JSON.parse(value) : value) : (noParse ? {} : undefined)
      } catch (e) {
        console.error(e)
      }
    },

    /* 设置缓存 */
    setLocalStorage(key, value) {
      try {
        wx.setStorageSync(key, typeof value === 'object' ? JSON.stringify(value) : value)
      } catch (e) {
        console.error(e)
      }
    },
    /* 禁止滑动 */
    nocCatchTap() {}
  },
})