const http = require('../../utils/http')
const utils=require('../../utils/util')
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

        this.getMomentsList(options.userId);


    },
    onShow(){
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
        let bool=Number(!this.data.userInfo.attentionFlag)
        http.request({
            url: '/attention/saveUserAttention',
            data: {
                beAttentionUid: this.data.userInfo.userId,
                attentionFlag: bool
            },

            callBack: (res) => {
                let attentionFlag=this.data.userInfo.attentionFlag
                this.setData({
                    'userInfo.attentionFlag':!attentionFlag
                })

            }
        })
    },
    ToImTalk(){
        wx.showLoading();
        let conversationID='C2C'+this.data.userInfo.userNumber;

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

            callBack:(res) =>{
                console.log(res, 'res----')
                if(res.data.userInterest){
                    res.data.userInterest=res.data.userInterest.split(',')
                }



                that.setData({
                    userInfo: res.data
                })

                app.saveWatchHistory(res.data)
            }
        })

    },
    // 获取个人动态列表
    getMomentsList(id) {
        http.request({
            url: '/moments/pageMoments',
            method:'GET',
            data: {
                requestType: 1,
                userId:id,
                pageSize: 10,
                pageNum:this.data.currentPage
            },
            callBack:(res)=>{
                let arr=[],now = Date.now() / 1000;
                res.data.records.forEach((item) => {
                    // 先换算一下时间  后端返回有距离多少个小时，和创建时间
                 let   createTime = new Date(item.createTime).getTime() / 1000;

                    item.timeLong = utils.formatTimeObject(now - createTime)
                    console.log(item.timeLong,'timelog------')
                    arr.push(item)



                })
                this.setData({
                    listData:res.data,
                    momentList:this.data.momentList.concat(res.data.records)
                        // [...this.data.momentList,...res.data.records]
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