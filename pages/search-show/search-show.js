// pages/search-prod-show/search-prod-show.js

var http = require('../../utils/http.js');
Page({

      /**
       * 页面的初始数据
       */
      data: {
            searchProdList: [],
            prodName: "",
            teacher: [],
            active: 0,
            showType: 0,
            tabList: [
                  {name: '文化类', id: 99},
                  {name: '艺术类', id: 103},
                  {name: '综合类', id: 176},
            ],
            query: {
                  requestType: 0,
                  content: ''
            }
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            if (options.id) {
                  this.setData({
                        showType: options.type,
                        'query.requestType': options.id
                  })
                  this.getSearchContent();
            }

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
      toSearchProdPage() {

      },
      chooseCategory(e) {
            let current = e.currentTarget.dataset.type;
            this.setData({
                  active: current,
                  'query.requestType': this.data.tabList[current].id
            })
            console.log(this.data.active)
      },
      getSearchContent(e) {
            if (e) {
                  this.setData({
                        'query.content': e.detail.value
                  })
            }


            http.request({
                  url: "/index/indexTeacher",
                  method: 'GET',
                  data: this.data.query,
                  callBack: (res) => {
                        console.log(res.record)
                        console.log(this.data.teacher, 'teacher---')
                        this.setData({
                              teacher: res.records
                        })
                  }

            })
      },
      clearValue() {
            this.setData({
                  prodName: ''
            })
      },
      goBackIndex() {
            wx.navigateBack()
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
