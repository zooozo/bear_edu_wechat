
const app=getApp()
const http=require('../../utils/http')
Page({
		
		data: {
			classList:[],
			// 1：进行中，2：拼团成功, 3:已取消，4: 拼团成功(已结算)
			statusList: ['进行中', '拼团成功', '已取消', '已结束'],
			numbers: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
		},
		onLoad(options) {
			this.getGroupList(options.id);
		},
		getGroupList(id) {
			http.request({
				url:'/groupClass/listTeacherClass',
				data:{teacherId:id || app.globalData.isTeacher.userId},
				method:'GET',
				callBack:(res)=>{
					res.forEach(item=>{
						item.createTime=item.createTime.split('T').toString().replace(',',' ');
						item.statusTxt=this.data.statusList[item.status]
					})
					this.setData({
						classList:res
					})
				}
			})
		}
	}
);
