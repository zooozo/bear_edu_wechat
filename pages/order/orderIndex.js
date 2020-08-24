const http = require('../../utils/http')


Page({
    data: {
        tabList: [{name: '我的订单', id: 1}, {name: '陪练订单', id: 2}],
        activeIndex: 0,
        orderData: {},
        params: {
            pageSize: 3,
            pageNum: 1
        },
        orderList: [],
        orderEntryList:[]
    },
    onLoad: function (options) {
        this.getOrderList();
        this.getFavirateList();
    },
    onChange(e) {
        this.setData({
            activeIndex: e.detail.name,
            orderList:[]
        })
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
    getFavirateList() {

        console.log("3333")
        let params = {
            url: '/index/index',
            method: "GET",
            data: {
                nickName: null,
                userNumber: null
            },
            callBack: res => {

                this.setData({
                    orderEntryList: [...res.data.records]
                })
            }
        }
        http.request(params);
    },
});