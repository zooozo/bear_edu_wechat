const http = require('../../utils/http')
const app = getApp();
Page({
    data: {
        userInfo: null,
        momentList:[],
        currentPage:1,
        listData:null
    },
    onLoad: function (options) {
        console.log(options, 'options')
        this.getPersonInfo(options.userId);
        this.getMomentsList();
    },
    // 复制
    copyId() {
        wx.setClipboardData({
            data: this.data.userInfo.userId + "",
            success(res) {

            },
            fail(err) {
                console.log(err, 'err---')
            }
        })
    },
    // 获取个人信息
    getPersonInfo(id) {
        // app.globalData.userInfo.userId     userId:30
        let that = this;
        wx.request({
            url: 'https://badmtn.weizhukeji.com/badmtn-api/p/user/queryUserInfo',
            method: 'GET',
            data: {
                userId: 8
            },
            header: {
                'Authorization': wx.getStorageSync('token')
            },
            success(res) {
                console.log(res, 'res----')
                that.setData({
                    userInfo: res.data.data
                })

            }
        })

    },
    // 获取个人动态列表
    getMomentsList() {
        http.request({
            url: '/moments/pageMoments',
            method:'GET',
            data: {
                requestType: 1,
                pageSize: 10,
                pageNum:this.data.currentPage
            },
            callBack(res){
                this.setData({
                    listData:res.data,
                    momentList:[...this.data.momentList,...res.data.records]
                })
            }
        })
    },
    // 用户下拉
    onPullDownRefresh: function () {
        if(this.data.currentPage<=this.data.listData.pages){
            let num=this.data.currentPage+1
            this.setData({
               currentPage:num
            })
            this.getMomentsList();
        }else{
            console.log("2222")
        }

    },
});