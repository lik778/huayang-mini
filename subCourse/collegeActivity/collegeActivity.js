import {
    getActivityColledgeList
} from "../../api/newapi/index";
Page({
    data: {
        pagesControl:{
            limit:10,
            offset:0
        },
        activityList: []
    },
    getActivityList() {
        getActivityColledgeList({
            colleage_activity:1,
            limit:this.data.pagesControl.limit,
            offset:this.data.pagesControl.offset
        }).then(x=>{
            let list = x.list;
            console.log(list);
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
    onLoad() {
        this.getActivityList();
    },
    onReachBottom(){
        this.getActivityList();
    }
})