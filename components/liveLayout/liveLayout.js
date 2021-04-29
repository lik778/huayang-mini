import { getLocalStorage, hasUserInfo } from "../../utils/util"
import { statisticsWatchNo } from "../../api/live/course"
import { GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"

Component({
  /**
   * Component properties
   */
  properties: {
    liveList: {
      type: Array,
      values: [],
      observer(list) {
        this.setData({list})
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    list: []
  },

  /**
   * Component methods
   */
  methods: {
    goToLiveback() {
      wx.navigateTo({url: "/subCourse/liveback/liveback", complete() {
          bxPoint("homepage_huikan_button", {}, false)
        }})
    },
    navigateToLive(e) {

      if (!hasUserInfo()) return this.triggerEvent("openUserAuth")
      let {
        zhiboRoomId, roomId, link, status, title, desc, roomType, startTime, endTime
      } = e.currentTarget.dataset.item

      statisticsWatchNo({
        zhibo_room_id: zhiboRoomId, // 运营后台配置的课程ID
        open_id: getLocalStorage(GLOBAL_KEY.openId)
      }).then(() => {
        // link存在去跳转回看页
        if (+status === 2 && link) {
          wx.navigateTo({
            url: `/subLive/review/review?zhiboRoomId=` + zhiboRoomId,
          })
        } else {
          wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(this.data.customParams))}`
          })
        }
      })
      bxPoint("homepage_live_click", {
        live_id: roomId,
        live_title: title,
        live_desc: desc,
        live_room_type: roomType,
        live_start_time: startTime,
        live_end_time: endTime,
      }, false)
    }
  }
})
