const http = require('../../utils/http')
const utils = require('../../utils/util')
const app = getApp();
Page({
      data: {
            userInfo: null,
            momentList: [],
            currentPage: 1,
            listData: null
      },
      onLoad: function (options) {





      },
      onShow() {
            this.getPersonInfo(this.options.userId);
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
      // 关注
      tapFollow() {
            let bool = Number(!this.data.userInfo.attentionFlag)
            http.request({
                  url: '/attention/saveUserAttention',
                  data: {
                        beAttentionUid: this.data.userInfo.userId,
                        attentionFlag: bool
                  },

                  callBack: (res) => {
                        let attentionFlag = this.data.userInfo.attentionFlag
                        this.setData({
                              'userInfo.attentionFlag': !attentionFlag
                        })

                  }
            })
      },
      ToConfirmOrder() {
            wx.navigateTo({
                  url:'/pages/createOrder/index'
            })
      },
      ToImTalk() {
            wx.showLoading();
            let conversationID = 'C2C' + this.data.userInfo.userNumber;

            // app.globalData.$TIM.tim.setMessageRead({conversationID});
            // console.log(' app.globalData.$TIM.tim', app.globalData.$TIM.tim)
            // return app.globalData.$TIM.tim.getConversationProfile(conversationID)
            //     .then(({data: {conversation}}) => {
            //         console.log(conversation, 'conversation-----')
            //         app.globalData.currentConversation = conversation
            //
            //         wx.hideLoading();
            //         wx.navigateTo({url: `/pages/news/chat/index?toAccount=${conversation.userProfile.userID}&type=${conversation.type}`})
            //         return Promise.resolve()
            //     })
      },
      // 获取个人信息
      getPersonInfo(id) {
            // app.globalData.userInfo.userId     userId:30
            let that = this;
            http.request({
                  url: '/p/user/queryUserInfo',
                  method: 'GET',
                  data: {
                        userId: id || 84
                  },

                  callBack: (res) => {
                        console.log(res, 'res----')
                        if (res.data.userInterest) {
                              res.data.userInterest = res.data.userInterest.split(',')
                        }


                        that.setData({
                              userInfo: res.data
                        })

                        app.saveWatchHistory(res.data)
                  }
            })

      },
      // 获取个人动态列表

      // 用户下拉
      onPullDownRefresh: function () {


      },
});