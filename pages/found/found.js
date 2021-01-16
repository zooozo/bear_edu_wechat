// pages/found/found.js

var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
var utils = require("../../utils/util.js");
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        list: [],
        activeIndex: 0,
          listData:{},
          // 1文化类 2艺术类 3综合类.
        categoryList: [
            {
                name: '文化类',
                id: 1,
            },
              {
                name: '艺术类',
                id: 2,
            },
            {
                name: '综合类',
                id: 3,
            },
        ],
        stopLoad: false,
        params: {
              type: 1,
              size: 10,
              current: 1
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */

    onChange(event) {

        this.setData({
            activeIndex: event.detail.name,
            'params.type': this.data.categoryList[event.detail.name].id,
            'params.current': 1,
            list: [],
        })
        this.getMomentsList();
    },
    getMomentsList() {
        wx.showLoading({
                title: '加载中'
            }
        );
        let params = {
            url: '/discoverInfo/page/'+this.data.params.type,
            method: 'GET',
            data: this.data.params,
            callBack: (res) => {
                  res.records.forEach(item=>{
                        item.thumbnail=app.globalData.imageHost+item.thumbnail
                  })

                  this.listData=res;

                  this.setData({
                        list:[...this.data.list,...res.records],
                        stopLoad:res.total<=this.data.params.size
                  })
                wx.hideLoading();
            }

        }
        http.request(params);
    },
    goToPage(e) {
          let current=e.currentTarget.dataset.item
        wx.navigateTo({
            url: '../discoverInfo/index?id='+current.id
        })
    },
    onLoad: function (options) {
        this.getMomentsList();
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

        if (this.data.params.pageNum < this.data.list.pages) {

            this.setData({
                'params.pageNum': this.data.params.pageNum + 1
            })
            this.getMomentsList();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 分类点击事件
     */




})