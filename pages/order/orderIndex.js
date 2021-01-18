const http = require('../../utils/http')


Page({
    data: {
        tabList: [{name: '我的订单', id: 1}, {name: '授课订单', id: 2}],
        activeIndex: 0,
        orderData: {},
        reasonIndex: 0,
        params: {
            pageSize:10,
            pageNum: 1
        },
        noticeText: ['临时有事，不想约了', '距离太远，不想约了'],
        orderList: [],
        orderEntryList:[],
        showModal:false,
        cancelData:{}
    },
    onReachBottom(){
      this.setData({
         
          'params.pageNum':this.data.params.pageNum+1
      })
        this.getOrderList();
    },
    onLoad: function (options) {
        this.getOrderList();

    },
    onChange(e) {
        this.setData({
            activeIndex: e.detail.name,
            orderList:[],
              'params.pageNum':1
        })
        console.log(e.detail.name,'name---')
        this.getOrderList();
    },
    getOrderList() {
        http.request({
            url: '/ballOrder/myOrder',
            method: 'GET',
            data: {
                type: this.data.tabList[this.data.activeIndex].id,
                pageSize: this.data.params.pageSize,
                pageNum: this.data.params.pageNum
            },
            callBack: (res) => {
                let txt = ''
                // 订单状态:{0:待付款 ,1:付款完成 ,2:已取消,3:已拒单,4:已完成 }-->
                res.data.records.forEach((item) => {
                    switch (Number(item.status)) {
                        case 0:
                            item.txt = '待付款';
                            break;
                        case 1:
                            item.txt = '已付款';
                            break;
                        case 2:
                            item.txt = '已取消';
                            break;
                        case 3:
                            item.txt = '已拒单';
                            break;
                        case 4:
                            item.txt = '已完成';
                            break;
                    }

                    item.amount = parseFloat(item.amount / 100).toFixed(2)
                })
                this.setData({
                    orderData: res.data,
                    orderList: [...this.data.orderList, ...res.data.records]
                })
                console.log(this.data.orderList, 'list---')
            }
        })
    },
    loadMoreOrder() {
        if (this.data.orderData.current < this.data.orderData.pages) {
            this.data.params.pageNum++
            this.setData({
                'params.pageSize': 10,
            })
            this.getOrderList();
        }
    },

    toOrderDetail(e){
        let id=e.currentTarget.dataset.item.trainerId
        // wx.navigateTo({
        //     url:'/pages/order/orderDetail/detail?id='+id+'?type='+this.data.activeIndex
        // })
          wx.navigateTo({
            url:'/pages/appraise/index?id='+id
        })
    },
    showCancelModal(e) {
        this.setData({
           'cancelData.trainerId':getApp().globalData.userInfo.userId,
           'cancelData.orderCode':e.currentTarget.dataset.current.orderCode,
        })
        let bool = e.currentTarget.dataset.state == '1'
        if(bool){
            wx.showModal({
                content:'确定取消订单吗',
                success:(res) =>{
                    console.log(res,'res000')
                    this.setData({

                        showModal: res.confirm
                    })
                }
            })
        }else{
            this.setData({
                showModal: false
            })
        }
    },
    chooseReason(e) {
        this.setData({
            reasonIndex: e.currentTarget.dataset.index
        })
    },
    cancelOrder(){

        http.request({
            url:'/ballOrder/cancelOrder',
            data:{
                orderCode:this.data.cancelData.orderCode,
                cancelReason:this.data.noticeText[this.data.reasonIndex],
                cancelType:1,
                // this.options.type==0?2:1
                trainerId:this.data.cancelData.trainerId
            },
            callBack:(res)=>{
                console.log(res,'res----')
                this.setData({
                    showModal: false
                })
                wx.showToast({
                    title:res.msg,
                    icon:'none'
                })
            }
        })
    },
});