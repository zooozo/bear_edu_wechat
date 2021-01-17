const http = require('../../utils/http')
const util = require('../../utils/util')

Page({
	data: {
		userData: {},
		showData: {
			stadium: null,
			time: null,
			timeStatus: ''
		},
		activeIndex: 0,
		weekList: ['周日', '周一', '周二', '周三', '周四', '周五', '周六',
		
		],//星期列表
		
		showTimeModal: false,
		tabWidth: null,
		scrollX: 32,//测试点击出来的第一个tab初始left
		tabIndex: 0,
		workTime: {},
		tabList: [],
		chooseTimeIndex: [],
		chooseCurrentIndex: null,
		disableTime: [],
		payType: 0,
		query: {
			channel: 1,
			refId: 1,
			
			trainerId: 84,
			timeCount: 0,
			type: 0,
			actualDate: '',
			timeQuantum: ''
		},
		params: {
			groupClassId: '',
			channel: 1,
			trainerId: '',
			type: 1
		}
	},
	onLoad: function (options) {
		console.log(options, 'options--')
		wx.getStorage({
			key: 'trainerUser',
			success: (res) => {
				console.log(res, 'res---')
				if (res.data.type == 1) {
					this.setData({
						userData: res.data,
						'query.trainerId': res.data.userId,
						'query.refId': res.data.categoryId
					})
					
					this.getPayOrderQuanTime()
				} else {
					this.setData({
						userData: res.data,
						'params.trainerId': res.data.teacherId,
						'params.groupClassId': res.data.id
					})
				}
				
			},
			fail(res) {
				console.log(res, 'error')
			}
		});
		
		
	},
	onShow() {
	
	},
	// 获取可以下单的时间列表
	getPayOrderQuanTime() {
		let that = this;
		http.request({
			url: '/trainer/selectTimeQuantum',
			method: 'GET',
			data: {
				trainerId: this.data.userData.userId || 84
			},
			callBack: (res) => {
				wx.showLoading()
				let data = res.data;
				console.log(data, 'data-----')
				let arr = data.orderTime ? data.orderTime.split(',') : [];
				let today = new Date();
				// 单日毫秒数
				let oneData = 86400000;
				
				// 重组tab数组
				let m = today.getMonth() + 1;
				let dateTime = Number(today.getDate()) < 10 ? '0' + today.getDate() : today.getDate()
				let tabList = [{
					week: '今天',
					date: (m < 10 ? '0' + m : m) + '-' + dateTime
				}]
				// 推算出后面一个星期
				console.log(new Date((today.getTime() + oneData)))
				for (let i = 1; i <= 31; i++) {
					let time = new Date((today.getTime() + oneData * i))
					tabList.push(that.getDateTime(time))
				}
				//重组orderTime数组。便于选中显示状态
				arr.forEach((item, index) => {
					arr[index] = {
						hour: item,
						select: false,
						disabled: false
						// select: false,  //选中状态
						// disable:false   //禁用状态
					}
				})
				console.log(arr, 'arr00')
				// 重组一下已下过单的时间
				if (data.mapList.length > 0) {
					data.mapList.forEach(item => {
						item.actualDate = item.actualDate.substring(5);
						item.disableTimeArr = item.timeQuantum.split(',');
						item.disableTimeArr.push(Number(item.disableTimeArr[item.disableTimeArr.length - 1]) + 1)
						
					})
					
					data.mapList[0].disableTimeArr.forEach((item, index) => {
						let current = arr.findIndex((current) => current.hour == item);
						if(arr[current]) arr[current].disabled = true
					})
				}
				
				
				data.orderTime = arr;
				
				//重组下过单时间的列表数组
				
				
				this.setData({
					disableTime: data.mapList,
					workTime: data,
					tabList: tabList,
					'query.actualDate': today.getFullYear()
				})
				console.log(tabList, 'odertime--');
				console.log(this.data.workTime, 'odertime--');
				wx.hideLoading()
			}
			
		})
		
	},
	// 获取每个Item
	getDateTime(date) {
		let m = date.getMonth() + 1
		let dateTime = Number(date.getDate()) < 10 ? '0' + date.getDate() : date.getDate()
		return {
			week: this.data.weekList[date.getDay()],
			date: (m < 10 ? '0' + m : m) + '-' + dateTime
		}
	},
	
	// 选择时间逻辑
	chooseOrderTime(e) {
		let idx = e.currentTarget.dataset.choose;
		let between;
		let orderTime = this.data.workTime.orderTime
		let chooseIndexList = this.data.chooseTimeIndex;
		
		if (orderTime[idx].disabled) return;
		console.log(idx, 'idx-----')
		
		
		/**
		 * 如果里面没有就添加
		 * 如果是取消了就删除
		 * **/
		orderTime[idx].select = !orderTime[idx].select;
		if (chooseIndexList.indexOf(idx) == -1) {
			chooseIndexList.push(idx)
		} else if (!orderTime[idx].select) {
			let i = chooseIndexList.indexOf(idx)
			chooseIndexList.splice(i, 1)
		}
		
		if (chooseIndexList.length > 1) {
			let back = chooseIndexList[chooseIndexList.length - 1] - chooseIndexList[chooseIndexList.length - 2] > 1
		
			let front = chooseIndexList[chooseIndexList.length - 1] - chooseIndexList[chooseIndexList.length - 2] < -1
			console.log(back,front,'true--------')
			if (back || front) {
				
				chooseIndexList.splice(chooseIndexList.length - 1, 1)
				// orderTime[idx].select=false;
				for (let i = 0; i < orderTime.length; i++) {
					for(let j=0;j<chooseIndexList.length;j++){
						
						if(i==chooseIndexList[j]){
							orderTime[i].select=true
						}else{
							if(orderTime[i]){
								orderTime[i].select=false
							}
							
						}
					}
					
				}
			
			}
		}
		
		
		console.log(chooseIndexList, 'chooseIndexList---')
		chooseIndexList.sort();
		this.setData({
			'workTime.orderTime': orderTime,
			chooseTimeIndex: chooseIndexList,
			chooseCurrentIndex: idx
		})
		
		
	},
	
	// 跳转球馆
	selectStadium() {
		wx.navigateTo({
			url: './choose-stadium/stadium'
		})
	},
	chooseTime() {
		let today = new Date();
		this.setData({
			showTimeModal: true,
			'query.actualDate': today.getFullYear()
		})
	},
	closeModal() {
		// 点击确定关闭
		let date = this.data.query.actualDate + '-' + this.data.tabList[this.data.activeIndex].date;
		let timeCount = [], arr = this.data.workTime.orderTime, arr2 = this.data.chooseTimeIndex;
		if (arr2.length == 1) {
			this.setData({
				showTimeModal: false,
			})
		} else {
			arr2 = Array.from(new Set(arr2))
			arr2.forEach(item => {
				timeCount.push(arr[item].hour)
			})
			timeCount.sort();
			// 显示的不需要截掉最后一个。传后台的数据要截掉最后一个
			this.setData({
				'showData.QuanTime': this.data.tabList[this.data.activeIndex].date + "  " + timeCount[0] + ":00 - " + timeCount[timeCount.length - 1] + ":00",
			})
			timeCount.splice(timeCount.length - 1, 1)
			this.setData({
				'query.actualDate': date,
				'query.timeCount': timeCount[timeCount.length - 1] - timeCount[0] + 1,
				'query.timeQuantum': timeCount.toString(),
				showTimeModal: false,
			})
			console.log(this.data.query, '---')
		}
		
		
	},
	getTabIndex(data) {
		
		let arr = this.data.workTime.orderTime;
		
		let disableTime = this.data.disableTime;
		arr.forEach(item => {
			item.select = false;
			item.disabled = false
		})
		let currentDay = this.data.tabList[data.detail].date;
		
		disableTime.forEach((item, index) => {
			
			if (item.actualDate == currentDay) {
				item.disableTimeArr.forEach((itm, idx) => {
					let current = arr.findIndex((current) => current.hour == itm);
					arr[current].disabled = true
				})
			}
			
			
		})
		this.setData({
			
			'workTime.orderTime': arr,
			activeIndex: data.detail,
			chooseTimeIndex: [],
			
		})
	},
	titleClick(e) {
		console.log('titleClick')
		let index = e.currentTarget.dataset.idx;
		let that = this
		util.getDomClientRect('.swiperItem' + index).then(res => {
			that.setData({
				scrollX: res[0].left * 2,//换算成rpx单位
				tabIndex: index
			})
		})
		
	},
	closeModal1() {
		// 点击XX按钮
		this.setData({
			showTimeModal: false,
		})
	},
	selectPayType(e) {
		if (this.data.userData.type == 1) {
			this.setData({
				"query.channel": Number(e.detail.value)
			})
		} else {
			this.setData({
				"params.channel": Number(e.detail.value)
			})
		}
		
	},
	payOrder(type) {
		http.request({
			url: '/ballOrder/payOrder',
			data: this.data.query,
			callBack: (res) => {
				wx.hideToast();
				if (res.code == 200) {
					if (type == 0) {
						this.requestPaymentForWX(res.data);
					} else {
						wx.navigateTo({
							url: '/pages/order/orderIndex'
						})
					}
					
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
				
			}
		})
		
	},
	groupClassOrder(type) {
		http.request({
			url: '/groupOrder/create',
			data: this.data.params,
			method: "POST",
			callBack: (res) => {
				console.log(type, 'type====')
				if (type == 0) {
					this.requestPaymentForWX(res.data);
				} else {
					if (res.code == 200) {
						wx.navigateTo({
							url: '/pages/order/orderIndex',
							success: (res) => {
								wx.showToast({
									title: '支付成功'
								})
							}
						})
					} else {
						wx.showToast({
							title: res.msg,
							icon: "none"
						})
					}
					
				}
			}
		})
		
	},
	createOrder() {
		
		if (!this.data.query.timeQuantum && this.data.userData.type == 1) {
			wx.showToast({
				icon: 'none',
				title: '请选择授课时间段'
			})
			return
		}
		let that = this;
		// qyyyNKno0QhOv7Mgc1Uk1qMkJQxV7WAamQ6I1zA47LA
		
		// 微信支付
		if (this.data.query.channel == 0 || this.data.params.channel == 0) {
			console.log('')
			wx.requestSubscribeMessage({
				tmplIds: ['g6h1Vhd3frq2B85MLoeTLto5I_SXzoDDEesfzKvVfMw'],
				
				complete() {
					if (that.data.userData.type == 1) {
						that.payOrder(0)
					} else {
						that.groupClassOrder(0)
					}
					
				}
			})
		} else {
			// 余额支付
			wx.showModal({
				title: '确认支付购买课程吗',
				success: (res) => {
					if (res.confirm) {
						if (this.data.userData.type == 1) {
							that.payOrder(1)
						} else {
							that.groupClassOrder(1)
						}
					}
				}
			})
			
		}
		
		
	},
	requestPaymentForWX(data) {
		// appId: "wxfa5368fa43713400"
		// nonceStr: "1597992055202"
		// packageValue: "prepay_id=wx21144055143891c80d802bd6366c770000"
		// paySign: "BD49BA5849BF4D9DB49CF1C3D8A28420"
		// signType: "MD5"
		// timeStamp: "1597992055"
		wx.requestPayment({
			timeStamp: data.timeStamp,
			nonceStr: data.nonceStr,
			package: data.packageValue,
			paySign: data.paySign,
			signType: data.signType,
			success(res) {
				wx.navigateTo({
					url: '/pages/order/orderIndex',
					success(res) {
						wx.showToast({
							title: ' 支付成功'
						})
					}
				})
			}
		})
	}
});