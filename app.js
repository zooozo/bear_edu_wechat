//app.js

var http = require("utils/http.js");

// const $TIM = require("plugins/IM_message")

App({
      onLaunch: function () {
            // this.globalData.$TIM = $TIM;
            http.getToken();
            wx.getSystemInfo({
                  success: (res) => {
                        this.globalData.screen = {
                              w: res.screenWidth,
                              h: res.screenHeight
                        }
                  }
            });
            wx.getStorage({
                  key: 'history',
                  fail: () => {
                        wx.setStorage({
                              key: 'history',
                              data: []
                        })
                  }
            })
      },
      // 复制
      copyData(data) {
            wx.setClipboardData({
                  data: data + "",
                  success(res) {

                  },
                  fail(err) {
                        console.log(err, 'err---')
                  }
            })
      },
      // 百度经纬度转腾讯的经纬度

      watch: function (ctx, obj, callBack) {
            Object.keys(obj).forEach(key => {
                  this.observer(ctx.data, key, ctx.data[key], function (value) {
                        obj[key].call(ctx, value)
                  })
            })
            if (callBack) {
                  callBack(obj)
            } else {
                  return obj
            }

      },
// 监听属性，并执行监听函数
      observer: function (data, key, val, fn) {
            Object.defineProperty(data, key, {
                  configurable: true,
                  enumerable: true,
                  get: function () {
                        return val
                  },
                  set: function (newVal) {
                        if (newVal === val) return
                        fn && fn(newVal)
                        val = newVal
                  },
            })
      },
      
      

      globalData: {
            resumen:{},
            isTeacher: {},
            // 定义全局请求队列
            requestQueue: [],
            // 是否正在进行登陆
            isLanding: true,
            // 购物车商品数量
            totalCartCount: 0,
            userInfo: {
                  // access_token: "90dfc3ad-a4a6-4d27-8638-d65d38b4ad4f",
                  // enabled: true,
                  // expires_in: 43199,
                  // nickName: "Rainie。",
                  // pic: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJHHJRWiaUTmjJFBYvicSJuHn1ia1GTDQkvPM3ykVs9ypE8bI9lfuOG5pq60xKeib9B1bEMbCJKYT2sag/132",
                  // refresh_token: "8c4f18aa-3fd3-4471-9c41-f6750cd702f5",
                  // token_type: "bearer",
                  // userId: 90
            },
            imageHost: 'http://eco-culture.oss-cn-shenzhen.aliyuncs.com/',
            params: {},//用于保存成为授课几个页面保存数据,
            trainerInfo: {},
            systemInfo: {},

      }
})


// {
//       "pagePath": "pages/news/news-page",
//     "text": "消息",
//     "iconPath": "images/tabbar/news.png",
//     "selectedIconPath": "images/tabbar/news-active.png"
// },