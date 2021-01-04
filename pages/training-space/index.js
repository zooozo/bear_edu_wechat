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
        teacher: {


        },
        RecommendList:null
    },
    onLoad: function (options) {
        console.log(options,'optiosn--')
        this.getTeacherInfo(options.id);
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
      wx.navigateTo({
          url:'/pages/create-order/index',
          success:(res)=> {
              // 把本页面的用户数据用数据带到打开的页面
              // res.eventChannel.emit('postUserData',user)
              wx.setStorageSync('trainerUser',this.data.teacher)
          }
      })
    },
    copyId() {
        app.copyData(this.data.userData.userId)
    },
    // 获取陪练信息
    getTeacherInfo(id){

        console.log(this.options,app.globalData.userInfo.userId)
        http.request({
            method: 'GET',
            url: '/apply/getTeacherResume',
            data: {
                userId:id || 3
            },
            callBack: (res) => {
                  let week=res.data.weekTime.split(',');
                  week.sort();
                  let arr=[]
                  week.forEach(item=>{
                       let data=this.data.weekList.find((weekCur)=>item==weekCur.id);
                       arr.push(data.name);
                  })
                  res.data.weekTime=arr.toString();
                 res.data.orderTime=res.data.orderTime.split(',')
                  res.data.orderPrice=parseFloat(res.data.orderPrice/100)
                  this.setData({
                        teacher:res.data
                  })

               console.log(res,'res--')
            }
        })
    },
    // 获取推荐列表
    onShow() {


    },
});