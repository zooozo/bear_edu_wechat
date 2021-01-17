const app = getApp()
const http = require('../../utils/http')
Page({
		
		data: {
			classList: [],
			// 1：进行中，2：拼团成功, 3:已取消，4: 拼团成功(已结算)
			statusList: ['','进行中', '拼团成功', '已取消', '已结束'],
			isSelf: false,
			numbers: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
		},
		onLoad(options) {
			if (options.id) {
				this.setData({
					isSelf: true
				})
			}
			
			this.getGroupList(options.id);
		},
		
		getGroupList(id) {
			http.request({
				url: '/groupClass/listTeacherClass',
				data: {teacherId: id || app.globalData.isTeacher.userId || 27},
				method: 'GET',
				callBack: (res) => {
					let arr=res;
					arr.forEach(item => {
						console.log('item',item)
						item.startTime = item.startTime.split('T').toString().replace(',', ' ');
						item.statusTxt = this.data.statusList[item.status]
						item.price = parseFloat(item.price/100).toFixed(2)
					})
					this.setData({
						classList: arr
					},()=>{
						console.log(this.data.classList,'calssList---')
					})
				}
			})
		},
		toPayOrder(e) {
			let current=e.currentTarget.dataset.item;
			current=Object.assign(current,{type:2,teacherId:this.options.id})
			wx.setStorage({
				key:'trainerUser',
				data:current,
				success(res) {
					wx.navigateTo({
						url: '/pages/createOrder/index',
					})
				}
			})
			
		}
	}
);
