// pages/found/found.js

var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
var utils = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // list: [
        //     {
        //         type: 1,
        //         imagelist: [
        //             "../../images/test/j1.png",
        //             "../../images/test/j2.png",
        //             "../../images/test/j3.png",
        //         ],
        //         pos:'22km',
        //         time:'2小时'
        //     },{
        //         type: 2,
        //         imagelist: [
        //             "../../images/test/j1.png",
        //
        //         ],
        //         pos:'1km',
        //         time:'4小时'
        //     },{
        //         type: 1,
        //         imagelist: [
        //             "../../images/test/j1.png",
        //             "../../images/test/j2.png",
        //
        //         ],
        //         pos:'1km',
        //         time:'11:50'
        //     },{
        //         type: 2,
        //         imagelist: [
        //             "../../images/test/j1.png",
        //             "../../images/test/j2.png",
        //             "../../images/test/j3.png",
        //         ],
        //         pos:'6km',
        //         time:'6:50'
        //     },
        // ],
        list:[],
        activeIndex: 0,
        categoryList: [
            {
                name: '广场',
                id: 1,
            },
            {
                name: '关注',
                id: 2,
            },
        ],
        params:{
            requestType:3,
            pageSize:10,
            pageNum:1
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */

    getMomentsList(){
      let params={
          url:'/moments/pageMoments',
          method:'GET',
          data:this.data.params,
          callBack:(res)=>{
              // let time=utils.formatTime(res.data.records[0].timeAgo*60*60*1000)
                let arr=[];
                let now=Date.now()/1000;
              let createTime;
                res.data.records.forEach((item)=>{
                    createTime=new Date(item.createTime).getTime()/1000;
                    item.timeLong=utils.formatTimeObject(now-createTime)
                    arr.push(item)
                })
              this.setData({
                  list:[...this.data.list,...arr]
              })
          }

      }
        http.request(params);
    },
    goToPage(){
        wx.navigateTo({
            url:'../moment-time/moment-time'
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

        if(this.data.params.pageNum<this.data.list.pages){

            this.setData({
                'params.pageNum':this.data.params.pageNum+1
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


    onChange(event) {

        this.setData({
            activeIndex: event.detail.name,
            'params.requestType':event.detail.name==0?3:2,
            'params.pageNum':1,
            list:[],
        })
        this.getMomentsList();
    },

})