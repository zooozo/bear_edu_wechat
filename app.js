//app.js
var http = require("utils/http.js");
App({
  onLaunch:function () {
    http.getToken();
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    });
    wx.getSystemInfo({
      success:(res)=> {
        this.globalData.screen={
          w: res.screenWidth,
          h: res.screenHeight
        }
      }
    })
  },
  userAuthSetting(txt){
    let that=this;
    return new Promise((re,rj)=>{
      wx.getSetting({
        success(res) {
          // 如果是还未授权的就弹出授权
          if (res.authSetting['scope.userLocation'] ==null) {
            wx.authorize({
              scope: 'scope.userLocation',
              success (res) {
                // 如果之前未获取授权权限
                wx.getLocation({
                  type: 'wgs84',
                  success(res) {
                    re({
                      stadiumLatitude:res.latitude,
                      stadiumLongitude:res.longitude
                    })
                  },
                  fail:()=>{
                    rj(false)
                  }
                })
              }
            })
          }else if(res.authSetting['scope.userLocation']===false){
            // 如果是弹出了授权然后用户点击了拒绝
            wx.showModal({
              title: '提示',
              content: '请在设置中允许获取您的地理位置',
              success:(res)=>{
                // 打开设置让用户打开位置权限
                wx.openSetting({
                  success (res) {
                    console.log(res.authSetting)
                    if(res.authSetting['scope.userLocation']){
                      wx.getLocation({
                        type: 'wgs84',
                        success(res) {

                          console.log("#3333")
                          re({
                            stadiumLatitude:res.latitude,
                            stadiumLongitude:res.longitude
                          })
                        },
                        fail:()=>{
                          console.log("3333")
                          rj(false)
                        }
                      })
                    }

                    // res.authSetting = {
                    //   "scope.userInfo": true,
                    //   "scope.userLocation": true
                    // }
                  }
                })
              }
            })

          }else{
            wx.getLocation({
              type: 'wgs84',
              success(res) {

                re({
                  stadiumLatitude:res.latitude,
                  stadiumLongitude:res.longitude
                })
              },
              fail:()=>{
                rj(false)
              }
            })
          }
        }
      })
    })

  },
  globalData: {
    // 定义全局请求队列
    requestQueue: [],
    // 是否正在进行登陆
    isLanding: true,
    // 购物车商品数量
    totalCartCount: 0,
    userInfo:{},
    imageHost:'http://eco-culture.oss-cn-shenzhen.aliyuncs.com/',
    params:{},//用于保存成为陪练几个页面保存数据,
    trainerInfo:{}

  }
})