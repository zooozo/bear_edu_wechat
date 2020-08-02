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
        userData: {},
        RecommendList:null
    },
    onLoad: function (options) {

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
    copyId() {
        wx.setClipboardData({
            data: this.data.userData.userId + "",
            success(res) {

            },
            fail(err) {
                console.log(err, 'err---')
            }
        })
    },

    getTrainerInfo(){
        http.request({
            method: 'GET',
            url: '/trainer/queryTrainer',
            data: {
                userId: 22
            },
            callBack: (res) => {
                //     <!--attentionFlag: true-->
                //     <!--begoodSkill: "扑球,高远球,搓球,杀球,劈叉,"-->
                //     <!--infoId: null-->
                //     <!--nickName: null-->
                //     <!--orderPrice: 20000-->
                //     <!--orderTime: "09,20"-->
                //     <!--receivingType: 1-->
                //     <!--skillLevel: 1-->
                //     <!--trainerDescribe: "了来咯窘境"-->
                // <!--trainerImg: "https://eco-culture.oss-cn-shenzhen.aliyuncs.com/2020/07/c374374a86f345e3975ca68fc14c1be3.jpg"-->
                //     <!--userId: 22-->
                //     <!--weekTime: "7,4,5,6,"-->
                res.begoodSkill = res.begoodSkill.replace(/,/g, '、');
                res.orderTime = res.orderTime.split(',');
                res.orderPrice = parseInt(res.orderPrice / 100)
                res.orderTime.sort();
                if (!res.nickName) {
                    res.nickName = app.globalData.userInfo.nickName
                }
                // res.skillLevel=this.data.skillLeave[res.skillLevel-1];
                res.weekList = ''
                if (res.receivingType == 1) {
                    let week = res.weekTime.split(',');
                    week.forEach((itm) => {
                        let index = this.data.weekList.findIndex((item) => item.id == itm);
                        console.log(index, 'index---')
                        if (index > -1) {
                            res.weekList += this.data.weekList[index].name + '、'
                        }

                    })
                } else {
                    res.weekList = '周一至周日'
                }


                this.setData({
                    userData: res
                })
            }
        })
    },
    getRecommendList(){
        console.log("3333")
        let params = {
            url: '/index/index',
            method: "GET",
            data: {
                nickName:'坦诚',
                userNumber:123456
            },
            callBack:res=>{

                this.setData({
                    RecommendList:[...res.records]
                })
            }
        }
        http.request(params);
    },
    onShow() {
        this.getTrainerInfo();
        this.getRecommendList();
    },
});