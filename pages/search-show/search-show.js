// pages/search-prod-show/search-prod-show.js

var http = require('../../utils/http.js');
Page({

      /**
       * 页面的初始数据
       */
      data: {
            searchProdList: [],
            prodName: "",
            teacher: '',
            activeIndex:0,
            query:{
                  requestType:0,
                  content:''
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
      toSearchProdPage(){

      },
      getSearchList() {
            http.request({
                  url: '/index/indexTeacher',
                  method: 'GET',
                  data: this.data.query,
                  callBack: (res) => {
                        res.records.forEach((item) => {
                              item.orderPrice = parseFloat(item.orderPrice / 100)
                        })
                        this.setData({
                              teacher: res.records
                        })
                        console.log(this.data.teacher, 'res===')
                  }
            })
      },
      clearValue() {
            this.setData({
                  prodName: ''
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
