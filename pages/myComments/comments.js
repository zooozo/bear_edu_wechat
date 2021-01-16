// pages/user/match.js

var http = require("../../utils/http.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        iconList: [
            '../../images/icon/yike.png',
            '../../images/icon/yike.png',
            '../../images/icon/yike.png',
            '../../images/icon/yike.png',
            '../../images/icon/yike.png'],
            commentsData:{},
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        http.request({
            url:'/trainerComment/myComments',
            method:'GET',
            callBack:(result)=>{
                
                for(let i=0;i<result.length;i++){
                    result[i].createTime=result[i].createTime.split('T').toString().replace('.',' ')
                    result[i].icons=[]
                    for(let j=0;j<result[i].stars;j++){
                       
                        result[i].icons.push({
                            icon:'../../images/icon/yike.png'
                        })
                    }
                }
                console.log(result,'result---')
                this.setData({
                    commentsData:result
                })
            }
        })
    },
    deleteComment(e){
        let current=e.currentTarget.dataset.item;
        wx.showModal({
            title:'提示',
            content:'确认删除这条评论？',
            success(res) {
                http.request({
                    url:'/trainerComment/removeMyComment',
                    method:'POST',
                    data:{
                        id:current.id
                    },
                    callBack:(res)=>{
                        wx.showToast({
                            title:'删除成功'
                        })
                    }
                })
            }
        })
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

   


})