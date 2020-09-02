// pages/search-prod-show/search-prod-show.js

import {isNumber} from "../../vant/common/utils";

var http = require('../../utils/http.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchProdList:[],
        prodName:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options,'slkdfj')
        this.setData({
            prodName: options.prodName
        });
        this.getSearchList();
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
    getSearchList(){
        let num=Number(this.data.prodName)
        let obj={}
            if(!isNumber(num)){
                obj.nickName=num;
            }else{
                obj.userNumber=num;
            }


        http.request({
            url:'/index/index',
            method:'GET',
            data:obj,
        })
    },
    clearValue(){
        this.setData({
            prodName:''
        })
    },
//当前搜索页二次搜索商品


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

    /**
     * 状态点击事件
     */
})
