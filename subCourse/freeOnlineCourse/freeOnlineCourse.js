import { getFreeOnlineCourse } from "../../api/course/index"

Page({
    data:{
        pagesControl:{
            limit:10,
            offset:0
        },
        videoList:[
        ]
    },
    onLoad(){
        this.getvideoList();
    },
    onReachBottom(){
        this.getvideoList();
    },
    toCourseDetail(e){
        let detail = e.currentTarget.dataset.video_detail;
        console.log(detail);
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
		} = e.currentTarget.dataset.item;
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
		})
	},
    getvideoList(){
        let params = {
            limit:this.data.pagesControl.limit,
            offset:this.data.pagesControl.offset
        };
        getFreeOnlineCourse(params).then(list=>{
            this.setData({
                videoList:this.data.videoList.concat(list),
                pagesControl:{
                    limit:this.data.pagesControl.limit,
                    offset:this.data.pagesControl.limit+this.data.pagesControl.offset,
                }
            })
        }).catch(err=>{
            console.log(err);
        })
    },

})
