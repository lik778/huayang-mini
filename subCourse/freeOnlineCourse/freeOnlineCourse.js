import { getFreeOnlineCourse } from "../../api/course/index"

Page({
    data: {
        pagesControl: {
            limit: 10,
            offset: 0
        },
        hasMore: true,
        videoList: []
    },
    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.getvideoList();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "一起学习花样老年大学精品免费课",
            path: "/subCourse/freeOnlineCourse/freeOnlineCourse"
        }
    },
    onReachBottom() {
        this.getvideoList();
    },
    /**
     * 跳转到视频详情页
     * @param e
     */
    goToVideoDetail(e) {
        let {
            id,
            name,
            desc
        } = e.currentTarget.dataset.item.kechengSeries;
        wx.navigateTo({
            url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
        })
    },
    getvideoList() {
        if (!this.data.hasMore) return
        let params = {
            limit: this.data.pagesControl.limit,
            offset: this.data.pagesControl.offset
        };
        getFreeOnlineCourse(params).then(list => {
            if (list.length < this.data.pagesControl.limit) {
                this.setData({hasMore: false})
            }
            this.setData({
                videoList: this.data.videoList.concat(list),
                pagesControl: {
                    limit: this.data.pagesControl.limit,
                    offset: this.data.pagesControl.limit + this.data.pagesControl.offset,
                }
            })
        }).catch(err => {
            console.log(err);
        })
    },
    onContactLogoTap() {
        wx.openCustomerServiceChat({
            extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc16674b49d8f7dc5f'},
            corpId: 'ww8d4cae43fb34dc92'
        })
    }
})
