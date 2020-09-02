var config = require("config.js");

//统一的网络请求方法
function request(params, isGetTonken) {
  // 全局变量
  console.log(getApp(),'app---')
  var globalData = getApp()? getApp().globalData:{};
  // 如果正在进行登陆，就将非登陆请求放在队列中等待登陆完毕后进行调用
  if (!isGetTonken && globalData.isLanding) {
    globalData.requestQueue.push(params);
    return;
  }

  wx.request({
    url: config.domain + params.url, //接口请求地址
    data: params.data,
    header: {
      // 'content-type': params.form && params.form === 1 ? 'content-type:multipart/form-data': 'application/json;charset=utf-8',
      'Authorization': params.login ? '' : wx.getStorageSync('token')
    },
    method: params.method == undefined ? "POST" : params.method,
    dataType: 'json',
    responseType: params.responseType == undefined ? 'text' : params.responseType,
    success: function(res) {
      if (res.statusCode == 200) {
        //如果有定义了params.callBack，则调用 params.callBack(res.data)
        if (params.callBack) {
          params.callBack(res.data);
        }

      }
      else if (res.statusCode == 500) {
        wx.showToast({
          title: "服务器出了点小差",
          icon: "none"
        });
      }
      else if (res.statusCode == 401) {
        // 添加到请求队列
        globalData.requestQueue.push(params);
        // 是否正在登陆
        if (!globalData.isLanding) {
          globalData.isLanding = true
          //重新获取token,再次请求接口
          getToken();
        }
      }
      else if (res.statusCode == 400) {
        wx.showToast({
          title: res.data,
          icon: "none"
        })

      }
      else {
        //如果有定义了params.errCallBack，则调用 params.errCallBack(res.data)
        if (params.errCallBack) {
          params.errCallBack(res);
        }
      }
      if (!globalData.isLanding) {
        wx.hideLoading();
      }
    },
    fail: function(err) {
      wx.hideLoading();
      wx.showToast({
        title: "服务器出了点小差",
        icon: "none"
      });
    }
  })
}

//通过code获取token,并保存到缓存
var getToken = function() {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      request({
        login: true,
        url: '/login?grant_type=mini_app',
        data: {
          principal: res.code,
          loginType:1
        },
        callBack: result => {
          console.log(result,'reslut-------')
          var globalData = getApp().globalData;
          globalData.userInfo=result
          // 没有获取到用户昵称，说明服务器没有保存用户的昵称，也就是用户授权的信息并没有传到服务器

          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userInfo']) {
                wx.navigateTo({
                  url: '/pages/mobile/mobile',
                })
              }else{
                getImUserInfo()
              }
            }
          });
          if (result.userStutas == 0) {
            wx.setStorageSync('token', '');
          } else {
            wx.setStorageSync('token', 'bearer' + result.access_token); //把token存入缓存，请求接口数据时要用
          }

          globalData.isLanding = false;
          while (globalData.requestQueue.length) {
            request(globalData.requestQueue.pop());
          }
        }
      }, true)

    }
  })
}

// 更新用户头像昵称
function updateUserInfo() {
  wx.getUserInfo({
    success: (res) => {
      var userInfo = JSON.parse(res.rawData);
      console.log(userInfo,'wxInfo')
      getApp().globalData.userInfo=userInfo
      request({
        url: "/p/user/setUserInfo",
        method: "PUT",
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          sex:userInfo.gender
        },
        callBack:()=>{
          getImUserInfo()

        }
      });
    }
  })
}
function getImUserInfo(){
  request({
    url:'/instanmessaging/generateIMusers',
    method:'GET',
    callBack:(res)=>{
      console.log(res,'res----');
      // 如果是新注册的用户
      if(res.code==200){
        getApp().globalData.ImUserInfo=res.data;
        LoginIm();
      }else{
        // 已经生成过IM用户数据的
        checkImUser();
      }

    }
  })
}
// 登录IM聊天
function LoginIm(){
  let that=this;
request({
    url:'/instanmessaging/genSigByUserId',
    method:'GET',
    callBack:(res)=>{
      getApp().globalData.$TIM.tim.login({
        userID: getApp().globalData.ImUserInfo.identifier,
        userSig:res.data.sign
      })
    }
  })
}
function checkImUser(){
  request({
    url:'/instanmessaging/getIMusers',
    method:'GET',
    callBack:(res)=>{
      if(res.code==200){
        getApp().globalData.ImUserInfo=res.data;
       LoginIm();
      }
      // $TIM.tim.login({
      //     userID: 'user1',
      //     userSig: 'eJyrVgrxCdZLrSjILEpVsjI2NDU2MwACHbBwWWqRkpWSkZ6BEoRfnJKdWFCQmaJkZWhiYGBsaWBuYASRyUxJzSvJTMsEaygtTi0yhGnJTAeKeBUZe4eb*IT5eVZEBEb6WhZ7V5a7uBhrhzpHePgaOZU65bhGprtb*ht6W9hCNZZk5gIdZGhqaWFibGBsbFQLACAVME8_'
      // })
    }
  })
}
//获取购物车商品数量
function getCartCount() {
  var params = {
    url: "/p/shopCart/prodCount",
    method: "GET",
    data: {},
    callBack: function(res) {
      if (res > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: res + "",
        })
        var app = getApp();
        app.globalData.totalCartCount = res;
      } else {
        wx.removeTabBarBadge({
          index: 2
        })
        var app = getApp();
        app.globalData.totalCartCount = 0;
      }
    }
  };
  request(params);
}


exports.getToken = getToken;
exports.request = request;
exports.getCartCount = getCartCount;
exports.updateUserInfo = updateUserInfo;