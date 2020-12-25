const http = require('../../utils/http')
const app = getApp();
Page({
    data: {
        skillList: [
            {
                text: '通俗易懂',
                num: 3
            }, {
                text: '耐心很好',
                num: 3
            }, {
                text: '知识渊博',
                num: 1
            }, {
                text: '一表人才',
                num: 8
            }, {
                text: '为人师表',
                num: 11
            }, {
                text: '风趣儒雅',
                num: 22
            }
        ],
        weekList: [
            // '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',
            {name: '周日', id: 7},
            {name: '周一', id: 1},
            {name: '周二', id: 2},
            {name: '周三', id: 3},
            {name: '周四', id: 4},
            {name: '周五', id: 5},
            {name: '周六', id: 6},
        ],
        skillLeave: ['业余一级', '业余二级', '业余三级'],
        userData: {


        },
        RecommendList:null
    },
    onLoad: function (options) {
        this.getTrainerInfo();
    },
    tapFollow() {
        let bool=Number(!this.data.userData.attentionFlag)
        http.request({
            url: '/attention/saveUserAttention',
            data: {
                beAttentionUid: this.data.userData.userId,
                attentionFlag: bool
            },

            callBack: (res) => {
                let attentionFlag=this.data.userData.attentionFlag
               this.setData({
                   'userData.attentionFlag':!attentionFlag
               })

            }
        })
    },
    goToPayOrder(){
        let user=this.data.userData
      wx.navigateTo({
          url:'/pages/create-order/index',
          event:{
              // postUserData: function(data) {
              //     console.log(data,'前一个节目')
              // },
          },
          success(res) {
              // 把本页面的用户数据用数据带到打开的页面
              // res.eventChannel.emit('postUserData',user)
              wx.setStorageSync('trainerUser',user)
          }
      })
    },
    copyId() {
        app.copyData(this.data.userData.userId)
    },
    // 获取陪练信息
    getTrainerInfo(){
        let id=this.options.userId?this.options.userId:app.globalData.userInfo.userId
        console.log(this.options,app.globalData.userInfo.userId)
        http.request({
            method: 'GET',
            url: '/trainer/queryTrainer',
            data: {
                userId:110
            },
            callBack: (res) => {
                console.log(res,'res-----')
                app.saveWatchHistory(res)

                res.begoodSkill = res.begoodSkill.replace(/,/g, '、');
                res.orderTime = res.orderTime.split(',');
                res.orderPrice = parseFloat(res.orderPrice / 100).toFixed(2)

                if (!res.nickName) {
                    res.nickName = app.globalData.userInfo.nickName
                }
                // res.skillLevel=this.data.skillLeave[res.skillLevel-1];
                res.weekList = ''
                if (res.receivingType == 2) {
                    let week = res.weekTime.split(',');
                    week.sort();
                    week.forEach((itm) => {
                        let index = this.data.weekList.findIndex((item) => item.id == itm);

                        if (index > -1) {
                            res.weekList += this.data.weekList[index].name + '、'
                        }

                    })
                } else {
                    res.weekList = '周一至周日'
                }
                // 保存浏览记录

                this.setData({
                    userData: res,
                })
                this.getAppraise();
                this.getValuation();
            }
        })
    },
    getAppraise(){
        http.request({
            url:'/evaluation/getEvaluationStatistics',
            method:'GET',
            data:{
                beCommentUid:this.data.userData.userId,
                pageSize:10,
                pageNum:1
            },
            callBack(res){

            }
        })
    },
    ToImTalk(){
        wx.showLoading();
        let conversationID='C2C'+this.data.userData.userNumber;

        // app.globalData.$TIM.tim.setMessageRead({conversationID});
        console.log(' app.globalData.$TIM.tim', app.globalData.$TIM.tim)
        return app.globalData.$TIM.tim.getConversationProfile(conversationID)
            .then(({data: {conversation}}) => {
                console.log(conversation, 'conversation-----')
                // context.commit('updateCurrentConversation', conversation)
                // 保存当前点击的聊天信息
                app.globalData.currentConversation = conversation

                // let name = ''
                // switch (conversation.type) {
                //     case  app.globalData.$TIM.tim.TYPES.CONV_C2C:
                //         name = conversation.userProfile.nick || conversation.userProfile.userID
                //         break
                //     case  app.globalData.$TIM.tim.TYPES.CONV_GROUP:
                //         name = conversation.groupProfile.name || conversation.groupProfile.groupID
                //         break
                //     default:
                //         name = '系统通知'
                // }
                wx.hideLoading();
                wx.navigateTo({url: `/pages/news/chat/index?toAccount=${conversation.userProfile.userID}&type=${conversation.type}`})
                return Promise.resolve()
            })
    },
    getValuation(){
       http.request({
           url:'/evaluation/getEvaluationPages',
           method:'GET',
           data:{
               beCommentUid:this.data.userData.userId,
               pageSize:10,
               pageNum:1
           }
       })
    },
    // 获取推荐列表
    onShow() {


    },
});