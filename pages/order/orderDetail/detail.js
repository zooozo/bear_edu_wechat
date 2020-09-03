const http = require('../../../utils/http')
const app = getApp();
Page({
    data: {
        orderData: {},
        noticeText: ['临时有事，不想约了', '距离太远，不想约了'],
        reasonIndex: 0,
        showModal: false,
        animation: null,
    },
    onLoad: function (options) {
        console.log(options, 'options---')
        this.getOrderDetail(options.id);

    },


    copyOrderId() {
        app.copyData(this.data.orderData.orderCode)
    },
    ToLeaveMessage() {
        wx.navigateTo({
            url: 'pages/training-space/index?id=' + this.data.orderData.trainerId
        })
    },
    ToTrainerSpace() {
        wx.navigateTo({
            url: '/pages/training-space/index?id=' + this.data.orderData.trainerId + '?order=' + this.data.orderData.orderCode
        })
    },
    showCancelModal(e) {
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
                orderCode:this.data.orderData.orderCode,
                cancelReason:this.data.noticeText[this.data.reasonIndex],
                cancelType:2,
                // this.options.type==0?2:1
                trainerId:this.data.orderData.trainerId
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
    openLocationAddress(){
        let latitude,longitude;
        app.bMapTransQQMap()
        wx.openLocation({
            latitude,
            longitude,
            scale: 18
        })
    },
    getOrderDetail(id) {
        wx.showLoading();
        http.request({
            url: '/ballOrder/orderDetails',
            method: 'GET',
            data: {
                id: id ? id + '' : 112
            },
            callBack: (res) => {

                let state = Number(res.data.status)
                // <!--    订单状态:{0:待付款 ,1:付款完成 ,2:已取消,3:已拒单,4:已完成 }-->
                switch (state) {
                    case 0:
                        res.data.statusText = '待付款';
                        break;
                    case 1:
                        res.data.statusText = '进行中';
                        break;
                    case 2:
                        res.data.statusText = '已取消';
                        break;
                    case 3:
                        res.data.statusText = '已拒单';
                        break;
                    case 4:
                        res.data.statusText = '已完成'
                        break;
                }
                res.data.amount = parseFloat(res.data.amount / 100).toFixed(2)
                this.setData({
                    orderData: res.data
                })
                wx.hideLoading();
            },
        })
    }
});