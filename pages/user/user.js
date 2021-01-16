// pages/user/user.js

var http = require("../../utils/http.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderAmount: '',
        sts: '',
        collectionCount: 0,
        list: [
            {url: '../../images/icon/order.png', text: '我的订单'},
            {url: '../../images/icon/quan.png', text: '优惠券'},
            // {url: '../../images/icon/qiandao.png', text: '签到有礼'},
            {url: '../../images/icon/bag.png', text: '我的账户'},
        ],
        settingList: [
            {url: '../../images/icon/lishi.png', text: '我的简历', path: '/pages/addResume/index'},
            {url: '../../images/icon/setting.png', text: '课程设置', path: '/pages/setMyClass/index'},
            {url: '../../images/icon/setting.png', text: '创建团课', path: '/pages/createGroupClass/index'},

        ]
    },
    tapList(e) {
        let type = e.currentTarget.dataset.current;
        let url = '';
        switch (Number(type)) {
            case 0:
                url = '/pages/order/orderIndex'


                break;
            case 1:
                url = '/pages/coupon/coupon'
                break;
            case 2:
                url = '/pages/mybag/index'
                break;
        }
        wx.navigateTo({url: url});

    },
    tapSettingList(e) {
        let item = e.currentTarget.dataset.current;
        let url = '';
        if(item.path){
              wx.navigateTo({url: item.path});
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    toDistCenter: function () {
        wx.showToast({
            icon: "none",
            title: '该功能未开源'
        })
    },

    toCouponCenter: function () {
        wx.showToast({
            icon: "none",
            title: '该功能未开源'
        })
    },

    toMyCouponPage: function () {
        wx.showToast({
            icon: "none",
            title: '该功能未开源'
        })
    },

    toAddressList: function () {
        wx.navigateTo({
            url: '/pages/delivery-address/delivery-address',
        })
    },

    // 跳转绑定手机号
    toBindingPhone: function () {
        wx.navigateTo({
            url: '/pages/binding-phone/binding-phone',
        })
    },

    toOrderListPage: function (e) {
        var sts = e.currentTarget.dataset.sts;
        wx.navigateTo({
            url: '/pages/orderList/orderList?sts=' + sts,
        })
    },
    /**
     * 查询所有的收藏量
     */
    showCollectionCount: function () {
        var ths = this;
        wx.showLoading();
        var params = {
            url: "/p/user/collection/count",
            method: "GET",
            data: {},
            callBack: function (res) {
                wx.hideLoading();
                ths.setData({
                    collectionCount: res
                });
            }
        };
        http.request(params);
    },
    /**
     * 我的收藏跳转
     */
    myCollectionHandle: function () {
        var url = '/pages/prod-classify/prod-classify?sts=5';
        var id = 0;
        var title = "我的收藏商品";
        if (id) {
            url += "&tagid=" + id + "&title=" + title;
        }
        wx.navigateTo({
            url: url
        })
    }


})