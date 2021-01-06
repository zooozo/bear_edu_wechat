//app.js

import {tim} from "./plugins/IM_message";

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
    userAuthSetting(txt) {
        let that = this;
        return new Promise((re, rj) => {
            wx.getSetting({
                success(res) {
                    // 如果是还未授权的就弹出授权
                    if (res.authSetting['scope.userLocation'] == null) {
                        wx.authorize({
                            scope: 'scope.userLocation',
                            success(res) {
                                // 如果之前未获取授权权限
                                wx.getLocation({
                                    type: 'wgs84',
                                    success(res) {
                                        re({
                                            stadiumLatitude: res.latitude,
                                            stadiumLongitude: res.longitude
                                        })
                                    },
                                    fail: () => {
                                        rj(false)
                                    }
                                })
                            }
                        })
                    } else if (res.authSetting['scope.userLocation'] === false) {
                        // 如果是弹出了授权然后用户点击了拒绝
                        wx.showModal({
                            title: '提示',
                            content: '请在设置中允许获取您的地理位置',
                            success: (res) => {
                                // 打开设置让用户打开位置权限
                                wx.openSetting({
                                    success(res) {
                                        console.log(res.authSetting)
                                        if (res.authSetting['scope.userLocation']) {
                                            wx.getLocation({
                                                type: 'wgs84',
                                                success(res) {

                                                    console.log("#3333")
                                                    re({
                                                        stadiumLatitude: res.latitude,
                                                        stadiumLongitude: res.longitude
                                                    })
                                                },
                                                fail: () => {
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

                    } else {
                        wx.getLocation({
                            type: 'wgs84',
                            success(res) {

                                re({
                                    stadiumLatitude: res.latitude,
                                    stadiumLongitude: res.longitude
                                })
                            },
                            fail: () => {
                                rj(false)
                            }
                        })
                    }
                }
            })
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
    bMapTransQQMap(lng, lat) {

        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;

        let x = lng - 0.0065;

        let y = lat - 0.006;

        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);

        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);

        let lngs = z * Math.cos(theta);

        let lats = z * Math.sin(theta);

        return {
            lng: lngs,

            lat: lats

        }

    },
    UploadMedia(data) {
        let that = this;
        let media = ['image', 'video']
        return new Promise((re, rj) => {
            wx.chooseMedia({
                mediaType: data.media || media,
                maxDuration: data.duration || 20,
                success(res) {
                    re(res)
                },
                fail(err) {
                    rj(err)
                }
            })
        })

    },
    UploadFileToOss(filePath, callBack) {
        wx.showLoading({
            title: '正在为您上传图片和视频',
            mask: true
        });
        wx.uploadFile({
            url: "https://dev.weizhukeji.com/badmtn-api/api/file/upload",    //模拟接口
            filePath: filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data',
                'Authorization': wx.getStorageSync('token')
            },
            formData: {
                folderName: 'file'
            },
            success: function (res) {
                callBack && callBack(res)
            }, fail: (err) => {
                console.log(err, 'err---')
                wx.hideLoading()
            }
        })
    },
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


    saveWatchHistory(data) {
        wx.getStorage({
            key: 'history',
            success(history) {
                console.log(history, 'history----')
                console.log(data, 'datahistory----')
                let obj = {
                    nickName: data.nickName,
                    pic: data.pic || data.trainerImg,
                    sex: data.sex || 0,
                    skillLeave: data.skillLeave || 0,
                    date: Date.now(),
                    userId: data.userId
                };
                // 如果里面有了
                let index = history.data.findIndex((item) => item.userId == obj.userId);
                if (index == -1) {
                    if (history.data.length <= 20) {
                        let arr = history.data;
                        arr.unshift(obj)
                        wx.setStorage({
                            key: 'history',
                            data: arr
                        })
                    } else {
                        let arr = history.data;
                        arr.shift(obj)
                        wx.setStorage({
                            key: 'history',
                            data: arr
                        })
                    }
                    obj = {}
                }

            }
        })
    },
    // 获取粉丝和关注数据，

    getAttentionPages(params) {

        http.request({
            url: '/attention/pageUserAttentionPages',
            data: params,
            method:'GET',
            callBack: (res) => {
                this.globalData.AttentionList = res.data.records;
            }
        })
    },

    globalData: {
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
        params: {},//用于保存成为陪练几个页面保存数据,
        trainerInfo: {},
        systemInfo: {},
        TimData: {},
        ImUserInfo: {
            userId: 'user1'
        },

    }
})