const http = require('../../utils/http')
const util = require('../../utils/util')

Page({
      data: {
            userData: {
                  attentionFlag: false,
                  begoodSkill: "扑球、高远球、斜线球、挑球、滑板吊球",
                  infoId: null,
                  nickName: "Rainie。",
                  orderPrice: 200,
                  orderTime: (2) ["13", "20"],
                  pic: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK49BapO9sOKX6Nk0r0uHoyibkumNZVQVBznERD2zjnXeTsvAz6GVE474MbLgUkQsOoKThOyj0zo6Q/132",
                  receivingType: 2,
                  skillLevel: 2,
                  trainerDescribe: "爱上了对方开具",
                  trainerImg: "2020/08/3e3d7fe79f5a472a9e93bcc0b509e5bc.jpg",
                  userId: 84,
                  weekList: "周一、周二、周三、周五、周六、",
                  weekTime: "5,1,2,6,3",
            },
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
            payType:0,
            query: {
                  channel: 0,
                  refId: 1,
                
                  trainerId: 84,
                  timeCount: 0,
                  type: 0,
                  actualDate: '',
                  timeQuantum: ''
            }
      },
      onLoad: function (options) {
            console.log(options,'options--')
            wx.getStorage({
                  key: 'trainerUser',
                  success: (res) => {
                        console.log(res, 'res---')
                        this.setData({
                              userData: res.data,
                              'query.trainerId': res.data.userId,
                              'query.refId': res.data.categoryId
                        })

                        this.getPayOrderQuanTime()
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
                        let arr = data.orderTime.split(',');
                        let today = new Date();
                        // 单日毫秒数
                        let oneData = 86400000;

                        // 重组tab数组
                        let m = today.getMonth() + 1;
                        let dateTime=Number(today.getDate())<10?'0'+today.getDate():today.getDate()
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
                                    arr[current].disabled = true
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
            let dateTime=Number(date.getDate())<10?'0'+date.getDate():date.getDate()
            return {
                  week: this.data.weekList[date.getDay()],
                  date: (m < 10 ? '0' + m : m) + '-' + dateTime
            }
      },

      // 选择时间逻辑
      chooseOrderTime(e) {
            let idx = e.currentTarget.dataset.choose;
            let between;
            // 显示的数组
            let arr = this.data.workTime.orderTime;
            // 记录点击的数组
            let arr2 = this.data.chooseTimeIndex
            arr2 = Array.from(new Set(arr2))
            //如果点击的是同一个

            let index = arr2.findIndex((item) => item == idx);
            if (arr[idx].disabled) return
            // 点击选中
            if (index > -1) {
                  arr2.sort();
                  // console.log(idx-1,arr.length-1,'排序前')
                  // console.log(idx,'idx===')
                  // console.log(arr2,'选中的数组')
                  // console.log(arr,'显示时间的数组')
                  // 如果点击的不是选中的第一个和最后一个
                  if (idx != arr2[0] && idx != arr2[arr2.length - 1]) {
                        let spliceArr = arr2.splice(index, arr.length - 1);
                        // console.log(spliceArr,'spliceArr----')
                        // arr[idx].select = !arr[idx].select;
                        //从中间选的把后面的截掉并把状态改成未选中
                        for (let i = 0; i < spliceArr.length; i++) {
                              // console.log(arr[i],'arr2====')
                              arr[spliceArr[i]].select = false;
                        }
                  } else {
                        // 如果是第一个或者最后一个就把状态改变并把存入选中的数组删掉

                        arr[idx].select = !arr[idx].select
                        arr2.splice(index, 1)
                        // console.log(arr2,'arr2---')
                  }

            } else {

                  arr2 = arr2.concat(idx)
                  // 先去重
                  arr2 = Array.from(new Set(arr2))
                  arr2.sort()
                  // 算出数组第一个和最后一个的差额
                  between = arr2[arr2.length - 1] - arr2[0];

                  //如果between小于0
                  if (between <= 0) {
                        // 说明是选中的相连的两个，改变其中一个值就可以了
                        arr[arr2[0]].select = !arr[arr2[0]].select;
                  } else {
                        // i=-1   因为要把自己也删掉
                        for (let i = -1; i < between; i++) {
                              arr[arr2[0] + i + 1].select = true;
                              // 把中间的也存入选中的数组当中
                              arr2 = arr2.concat(arr2[0] + i + 1)
                        }
                  }

            }

            this.setData({
                  'workTime.orderTime': arr,
                  chooseTimeIndex: arr2,
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
                  console.log(this.data.query,'---')
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
      selectPayType(e){
           
            this.setData({
                  "query.channel":Number(e.detail.value)
            })
      },

      createOrder() {

            if (!this.data.query.timeQuantum) {
                  wx.showToast({
                        title: '请选择授课时间段'
                  })
                  return
            }
            let that = this;
            // qyyyNKno0QhOv7Mgc1Uk1qMkJQxV7WAamQ6I1zA47LA
            wx.requestSubscribeMessage({
                  tmplIds: ['g6h1Vhd3frq2B85MLoeTLto5I_SXzoDDEesfzKvVfMw'],
                  success() {

                  },
                  fail(err) {
                        console.log(err)
                  },
                  complete() {
                        http.request({
                              url: '/ballOrder/payOrder',
                              data: that.data.query,
                              callBack: (res) => {
                                    wx.hideToast();
                                    console.log(res, 'res---')
                                    that.requestPaymentForWX(res.data);
                              }
                        })
                  }
            })

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
                              url: '/pages/order/orderIndex'
                        })
                  }
            })
      }
});