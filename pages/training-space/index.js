const http = require('../../utils/http')
const app = getApp();
Page({
    data: {
        skillList: [
            {
                text: '球技很好',
                num: 3
            }, {
                text: '长的漂亮',
                num: 3
            }, {
                text: '声音好听',
                num: 1
            }, {
                text: '球技很好',
                num: 8
            }, {
                text: '球技很好',
                num: 11
            }, {
                text: '球技很好',
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
            console.log(options,'alsdkfjlasd')
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
                userId:this.options.userId
            },
            callBack: (res) => {
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


                this.setData({
                    userData: res,
                    'userData.pic': app.globalData.userInfo.pic,
                })
                this.getAppraise();
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
    // 获取推荐列表
    onShow() {
        this.getTrainerInfo();
    },
});