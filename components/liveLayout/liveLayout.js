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
        zhiboRoomId,
        roomId,
        link,
        status,
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
        setTimeout(() => {
          // 更新直播间观看次数
          let list = [...this.data.liveList]
          list.forEach(_ => {
            if (_.zhiboRoomId === zhiboRoomId) {
              _.visitCount += 1
            }
          })
          this.setData({
            liveList: [...list]
          })
        }, 1000)
      })

      bxPoint("homepage_live_click", {
        live_id: e.roomId,
        live_title: e.title,
        live_desc: e.desc,
        live_room_type: e.roomType,
        live_start_time: e.startTime,
        live_end_time: e.endTime,
      }, false)
    }
  }
})
