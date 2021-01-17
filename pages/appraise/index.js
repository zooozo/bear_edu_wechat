const http = require('../../utils/http')
const app = getApp();
Page({
	data: {
		topList: [
			{
				select: '../../images/appraise/select0.png',
				unselect: '../../images/appraise/unselect0.png',
				iconClass: 'icon1',
				iconClass1: 'icon2',
				text: '非常满意',
				textClass1: 'default',
				textClass2: 'active'
			},
			
			{
				select: '../../images/appraise/select2.png',
				unselect: '../../images/appraise/unselect2.png',
				text: '不满意',
				iconClass: 'icon1',
				iconClass1: 'icon2',
				textClass1: 'default',
				textClass2: 'active'
			},
		],
		iconList: [
			'../../images/icon/hui.png',
			'../../images/icon/hui.png',
			'../../images/icon/hui.png',
			'../../images/icon/hui.png',
			'../../images/icon/hui.png'],
		
		query: {
			whetherSatisfied: 0,
			evaluateContent: '',
			stars: 0,
			trainerId: ''
		},
		appraiseText: 0,
		commentsList: [],
		chooseCommon: [],
		appraiseContent: ''
	},
	onLoad: function (options) {
		this.setData({
			'query.trainerId':options.id
		})
	},
	
	chooseAppraise(e) {

		let index = e.currentTarget.dataset.index
          console.log(index);
		this.setData({
			'query.whetherSatisfied': index
		})
	},
	getText(e) {
		let str = e.detail.value;
		console.log(e, 'e---')
		this.setData({
			appraiseText: str.length
		})
	},
	getAppraiseText(e) {
		let str = e.detail.value;
		console.log(e, 'e---')
		this.setData({
			'query.evaluateContent': e.detail.value
		})
	},
	changeStar(e) {
		
		let num = e.currentTarget.dataset.num;
		console.log(num, '000')
		let arr = this.data.iconList;
		console.log(arr[num].indexOf('hui') > -1, 'index-=--')
		for (let i = 0; i < 5; i++) {
			
			if (i <= num && arr[num].indexOf('hui') > -1) {
				arr[i] = '../../images/icon/yike.png'
				
			} else if (i <= num && arr[num].indexOf('yike') > -1) {
				
				arr[i] = '../../images/icon/yike.png'
			} else {
				arr[i] = '../../images/icon/hui.png'
			}
		}
		let select=arr.filter(item=>item.indexOf('yike')>-1)
		this.setData({
			iconList: arr,
			'query.stars': select.length
		})
	},
	
	toAppraise() {
		// !CurrentEmoji && chooseCommon.length==0 && appraiseText.length==0
		if (!this.data.query.evaluateContent) {
			wx.showToast({
				title: '请输入评价内容',
				icon: "none"
			})
			return
		}
		if (!this.data.query.stars) {
			wx.showToast({
				title: '请进行评分',
				icon: "none"
			})
			return
		}
		
		
		http.request({
			url: '/trainerComment/createComment',
			data: this.data.query,
              form:1,
			callBack: (res) => {
				wx.showToast({
                      title:'评价成功'
                })

                  setTimeout(()=>{
                        wx.switchTab({
                              url:'/pages/user/user'
                        })
                  },600)
				
			}
		})
	}
});