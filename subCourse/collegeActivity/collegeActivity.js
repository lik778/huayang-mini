import { getActivityList } from "../../api/course/index"
import request from "../../lib/request"

Page({
    data: {
        pagesControl:{
            limit:10,
            offset:0
        },
        activityList: []
    },
    getActivityList() {
        getActivityList({
            colleage_activity:1,
            platform: 1,
            limit:this.data.pagesControl.limit,
            offset:this.data.pagesControl.offset
        }).then(x=>{
            let list = x.list;
            this.setData({
                activityList:this.data.activityList.concat(list),
                pagesContorl:{
                    limit:this.data.pagesControl.limit,
                    offset:this.data.pagesControl.offset+this.data.pagesControl.limit
                }
            })
        }).catch(err=>{
            console.log(err);
        })
    },
    onActivityTap(e) {
        let activityId = e.currentTarget.dataset.item.id
        if (activityId) {
            let link = `${request.baseUrl}/#/home/detail/${activityId}`
            wx.navigateTo({url: `/pages/activePlatform/activePlatform?link=${encodeURIComponent(link)}`})
        }
    },
    onLoad() {
        this.getActivityList();
    },
    onReachBottom(){
        this.getActivityList();
    }
})
