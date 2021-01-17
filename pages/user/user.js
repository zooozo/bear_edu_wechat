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
            {url: '../../images/icon/lishi.png', text: '我的评价', path: '/pages/myComments/comments',isShow:true},
            {url: '../../images/icon/lishi.png', text: '我的简历', path: '/pages/addResume/index',isShow:true},
           
            {url: '../../images/icon/setting.png', text: '课程设置', path: '/pages/setMyClass/index',isShow:true},
            {url: '../../images/icon/setting.png', text: '创建团课', path: '/pages/createGroupClass/index',isShow:true},
            {url: '../../images/icon/setting.png', text: '我的团课', path: '/pages/groupClassList/index',isShow:true},

        ],
        isHaveResume:false,
        myTeacherDetail:{},
        isSetClass:false
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
            this.data.isHaveResume=true;
            wx.showToast({
                icon:"none",
                title:'成为教师后开放功能'
            })
              
            
        }else if(item.text=='课程设置' && !this.data.isHaveResume){
            wx.showToast({
                icon:'none',
                title:'请先添加简历'
            })
          
        }else{
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
        // this.setData({
        //     myTeacherDetail: app.watch(this,app.globalData.isTeacher )
        // })
        // console.log(app.watch(app, app.globalData.isTeacher),'myTeacherDetail' )
        http.request({
            url: '/apply/getisTeacher',
            data: {userId:app.globalData.userInfo.userId},
            method: 'GET',
            callBack: (res) => {
                if(res.data){
                    app.globalData.isTeacher = res.data;
                    let state=res.data.trainerStatus ;
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
                        BtnStatus:state,
                       
                    })
                }else{
                    this.setData({
                        BtnStatus:4
                    })
                }

            }
        })
    
        http.request({
            method: 'GET',
            url: '/apply/getTeacherResume',
            data: {
                userId: app.globalData.userInfo.userId
            },
            callBack: (res) => {
                if(res.data){
                    console.log(res.data.yeCategoryId && res.data.yeCategoryId>0,'------')
                    let arr=this.data.settingList
                    arr[2].isShow=!res.data.yeCategoryId && res.data.yeCategoryId>0
                    this.setData({
                        isHaveResume:true,
                        settingList: arr
                    })
                    getApp().globalData.resume=res.data;
                }
            }
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