import dayjs from "dayjs"
// 媒体资源类型
const MEDIA_TYPE = {
  image: 1,
  video: 2,
  audio: 3
}

// 回显音频暂停、启动图标
const AUDIO_CALLBACK_IMAGE = {
  callback_audio_pause: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607503757nGTLDx.jpg",
  callback_audio_start: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607505373jvyHel.jpg"
}

// 回显音频播放状态
const AUDIO_CALLBACK_STATUS = {
  start: "callback_audio_start",
  pause: "callback_audio_pause",
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    MEDIA_TYPE,
    AUDIO_CALLBACK_STATUS,
    AUDIO_CALLBACK_IMAGE,
    audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause,
    info: {},
    visibleReviewVideo: false,
    visibleReviewAudio: false,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 计算日期
     * @param timestring
     * @returns {string}
     */
    calcDate(timestring) {
      let result = ""
      let firstDateInThisYear = `${dayjs().year()}-01-01`
      if (dayjs(timestring).isBefore(dayjs(firstDateInThisYear))) {
        result = dayjs(timestring).format("YYYY-MM-DD [_]d HH:mm")
      } else {
        result = dayjs(timestring).format("MM-DD [_]d HH:mm")
      }

      result = result.replace(/_(\d)/, (matchString, p1) => {
        let replaceString = ""
        switch (+p1) {
          case 0: {
            replaceString = "周日"
            break
          }
          case 1: {
            replaceString = "周一"
            break
          }
          case 2: {
            replaceString = "周二"
            break
          }
          case 3: {
            replaceString = "周三"
            break
          }
          case 4: {
            replaceString = "周四"
            break
          }
          case 5: {
            replaceString = "周五"
            break
          }
          case 6: {
            replaceString = "周六"
            break
          }
        }
        return replaceString
      })

      return result
    },
    /**
     * 图片预览
     * @param e
     */
    reviewImages(e) {
      let sources = this.data.info.media_detail.map(img => {
        return {url: img}
      })
      wx.previewMedia({
        sources,
        current: e.currentTarget.dataset.index
      })
    },
    /**
     * 视频预览
     */
    reviewVideo() {
      this.triggerEvent("postMediaId", {taskId: this.data.info.taskId})
      this.setData({visibleReviewVideo: true})
    },
    reviewAudio() {},
    /**
     * 重置媒体状态
     */
    resetMediaStatus() {
      this.setData({visibleReviewVideo: false, visibleReviewAudio: false})
    }
  },
  lifetimes: {
    ready: function () {
      let {kecheng_work = {}, user = {}, work_comment_list, has_like, kecheng_name} = this.data.taskInfo || {}
      let {id: taskId, kecheng_id, kecheng_type, like_count, media_type, media_detail, title: desc, video_height, video_width, created_at, audio_length} = kecheng_work
      let {avatar_url, nick_name, id: userId} = user
      work_comment_list = work_comment_list || []
      work_comment_list = work_comment_list.map(item => {
        return {
          comment: item.kecheng_work_comment.content,
          updated_at: this.calcDate(item.kecheng_work_comment.updated_at),
          teacherAvatar: item.teacher.avatar,
          teacherName: item.teacher.name,
        }
      })

      switch (media_type) {
        case MEDIA_TYPE.image: {
          media_detail = media_detail.split(",")
          break
        }
        case MEDIA_TYPE.video: {
          break
        }
        case MEDIA_TYPE.audio: {
          let minutes = audio_length / 60 | 0
          let seconds = audio_length % 60 | 0
          audio_length = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          break
        }
      }


      let info = {
        taskId,
        kecheng_id,
        kecheng_type,
        kecheng_name,
        has_like,
        like_count,
        media_type,
        media_detail,
        desc,
        video_height: video_height >= video_width ? 400 : 300,
        video_width: video_width >= video_height ? 400: 300,
        video_cover: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607583151WdjlCc.jpg",
        created_at: this.calcDate(created_at),
        audio_length,
        avatar_url,
        nick_name,
        userId,
        work_comment_list
      }

      console.log(info);

      this.setData({info})
    }
  },
})
