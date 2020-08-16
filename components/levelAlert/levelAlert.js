const ICON = [
	"",
	"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596425986goLNVh.jpg", // 经验提示钻石icon
	"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596426003xZXlEe.jpg", // 等级升级皇冠icon
]

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		number: {
			type: Number,
			observer(nv) {
				this.setData({no: nv})
				this.updateView()
			}
		}, // 经验值 || 等级数字
		hasGrade: {type: Number, value: false}, // false=>提升经验 true=>提升等级
		didShow: {type: Boolean, value: false},
		text02: {type: String, value: ""},
		text03: {type: String, value: ""},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		ICON,
		iconImage: "",
		text01: "",
		text02: "",
		text03: "",
		no: 0
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		toggle() {
			this.setData({
				didShow: !this.data.didShow
			})
		},
		updateView() {
			if (this.data.hasGrade) {
				this.setData({
					iconImage: ICON[2],
					text01: `恭喜您升至Lv${this.data.no}`,
					text02: `已解锁全部Lv${this.data.no}课程`,
				})
			} else {
				this.setData({
					iconImage: ICON[1],
					text01: `成长值 +${this.data.no}`,
					text02: this.data.text02 ? this.data.text02 : '完成训练',
				})
			}
		}
	},
	attached() {
		this.updateView()
	},
})
