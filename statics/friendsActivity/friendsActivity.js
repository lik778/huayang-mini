import { getActivityList } from "../../api/course/index";
import dayjs from "dayjs";
import request from "../../lib/request";
import { ROOT_URL } from "../../lib/config";
import { getHistoryAlbums, getHistoryAlbumsById } from "../../api/competition/index";
import { $notNull } from "../../utils/util";
import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    publicList: [],
    albumList: [],
    comments: [
      {username: "玫玲", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644996985NSQWyD.jpg", comment: "花样大学以其“精致育精品”拥有专业、敬业的师资队伍，富有创意、活力和走心的办学方略，怀有“和乐、大同、博爱”的治学情结。被“花样百姓”气势恢宏、格调高雅的走秀赛场所震撼；学习体验中，被线上丰富多元的系列课程所吸引；且行且习中，应聘纳入花样艺术团，开启沉浸式学习模式。"},
      {username: "四月", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644997012YpfIfz.jpg", comment: "太喜爱花样大学了，这里的课程不仅新颖而且品质一流。校友活动也非常棒，为我们提供了学习、展示、交际的大舞台。通过花样的学习中让我在50岁的年纪又感受到了学习的快乐以及对生活的热情。"},
      {username: "玉菁", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644997030NWdTsX.jpg", comment: "刚退休时的兴奋劲过去之后一度陷入了迷茫，日子突然失去了目标感。从朋友那听说了花样大学，期初以为也是较为传统的老年大学课程，接触之后才发现花样的课程非常新颖，而且课程老师、团队也都非常年轻，在花样让我找到了新的爱好提升了自我，还让我的状态越来越年轻了。"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.run()
    bxPoint("university_activity_page", {})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  run() {
    // 活动平台-近期活动
    getActivityList({offset: 0, limit: 3, platform: 1, status: 1, sort: "begin_time"})
      .then(({list}) => {
        if (list.length < this.data.limit) {
          this.setData({hasMore: false});
        }
        list = list || [];
        list = list.map(n => ({
          ...n,
          year: dayjs(n.start_time).year(),
          month: dayjs(n.start_time).month() + 1,
          date: dayjs(n.start_time).date(),
        }));
        this.setData({publicList: list});
      });

    getHistoryAlbums().then((albums) => {
      let ids = []
      albums = albums.slice(0, 1)
      albums.forEach((ab) => {
        Object.entries(ab).forEach(([key, values]) => {
          ids = [...ids, ...values.map(n => n.album_id)]
        })
      })

      getHistoryAlbumsById({ids: ids.join(",")}).then((data) => {
        let ary = []
        albums.forEach((ab) => {
          let list = []
          Object.entries(ab).forEach(([key, values]) => {
            list = data.map(n => {
              let target = values.find(_ => _.album_id === n.id)
              if ($notNull(target)) {
                n.cover = n.cover + "?" + +new Date()
                n.pic_count = n.pic_count >= 10000 ? (n.pic_count / 10000).toFixed(1) + "w" : n.pic_count
                n.video_count = n.video_count >= 10000 ? (n.video_count / 10000).toFixed(1) + "w" : n.video_count
                n.view_count = n.view_count >= 10000 ? (n.view_count / 10000).toFixed(1) + "w" : n.view_count
                target.album = n
              } else {
                target = null
              }
              return target
            })
            ary.push({name: key, content: list.filter(n => n)})
          })
        })

        ary[0] = ary[0] && {name: ary[0].name, content: ary[0].content.reverse()}
        this.setData({albumList: ary})
      })
    })
  },

  // 查看近期活动
  goToPureWebview(e) {
    let {item} = e.currentTarget.dataset;
    let link = "";
    switch (request.baseUrl) {
      case ROOT_URL.dev: {
        link = 'https://dev.huayangbaixing.com';
        break;
      }
      case ROOT_URL.prd: {
        link = 'https://huayang.baixing.com';
        break;
      }
    }

    link += `/#/home/detail/${item.id}`;

    bxPoint("university_activity_list_click", {activity_id: item.id, activity_title: item.title, activity_run_date: item.run_time}, false)

    wx.navigateTo({url: `/pages/activePlatform/activePlatform?link=${encodeURIComponent(link)}`})
  },

  // 查看往期相册
  handleAlbumTap(e) {
    let {album_id, album} = e.currentTarget.dataset.item
    let link = `${request.baseUrl}/#/home/albums/${album_id}`
    bxPoint("university_photos_list_click", {photos_id: album_id, photos_title: album.name , photo_nums: album.pic_count, video_nums: album.video_count}, false)
    wx.navigateTo({url: "/pages/activityAlbum/activityAlbum?link=" + encodeURIComponent(link)})
  },

  // 查看更多
  goToMorePage(e) {
    let type = e.currentTarget.dataset.key
    switch(type) {
      case "public": {
        // 近期活动
        bxPoint("university_activity_more_click", {}, false)
        wx.navigateTo({url: "/pages/activities/activities"})
        break
      }
      case "albums": {
        // 赛事相册
        let link_url = "https://huayang.baixing.com/#/home/albumList"
        let link = `/pages/pureWebview/pureWebview?link=${link_url}`

        bxPoint("university_photos_more_click", {}, false)

        wx.navigateTo({url: link})
        break
      }
    }
  },
})
