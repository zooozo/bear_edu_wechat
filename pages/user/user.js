// pages/user/match.js

var http = require("../../utils/http.js");
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
          BtnStatus:'',
          BtnTxt:'',
        list: [
            {url: '../../images/icon/order.png', text: '我的订单'},
            {url: '../../images/icon/quan.png', text: '优惠券'},
            // {url: '../../images/icon/qiandao.png', text: '签到有礼'},
            {url: '../../images/icon/bag.png', text: '我的账户'},
        ],
        settingList: [
            {url: '../../images/icon/lishi.png', text: '我的评价', path: '/pages/myComments/comments'},
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
        if(item.text!='我的评价' && this.data.BtnStatus!=1){
              wx.showToast({
                    icon:"none",
                    title:'成为教师后开放功能'
              })
              return
        }
        if(item.path){
              wx.navigateTo({url: item.path});
        }

        
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('onload')
    
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
        console.log('onShow')
        let state=app.globalData.isTeacher.trainerStatus;
        console.log(state,'state------')
        let txt=''
        // 审核状态{0：待审核，1：审核通过，2：审核未通过}
        if(state==0){
            txt='待审核'
        }else if(state==2){
            txt='审核未通过'
        }else{
            txt=''
        }
        this.setData({
            BtnTxt:txt,
            BtnStatus:state
        })
        
        
        
    
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


})