var config = require("config.js");

//统一的网络请求方法
function request(params, isGetTonken) {
	// 全局变量
	var globalData = getApp() ? getApp().globalData : {};
	// 如果正在进行登陆，就将非登陆请求放在队列中等待登陆完毕后进行调用
	if (!isGetTonken && globalData.isLanding) {
		globalData.requestQueue.push(params);
		return;
	}
	
	wx.request({
		url: config.domain + params.url, //接口请求地址
		data: params.data,
		header: {
			'content-type': params.form && params.form === 1 ? "application/x-www-form-urlencoded; charset=UTF-8" : 'application/json;charset=utf-8',
			'Authorization': params.login ? '' : wx.getStorageSync('token'),
			
		},
		method: params.method == undefined ? "POST" : params.method,
		dataType: 'json',
		responseType: params.responseType == undefined ? 'text' : params.responseType,
		success: function (res) {
			if (res.statusCode == 200) {
				//如果有定义了params.callBack，则调用 params.callBack(res.data)
				if (params.callBack) {
					params.callBack(res.data);
				}
				
			} else if (res.statusCode == 500) {
				wx.showToast({
					title: "服务器出了点小差",
					icon: "none"
				});
			} else if (res.statusCode == 401) {
				// 添加到请求队列
				globalData.requestQueue.push(params);
				// 是否正在登陆
				if (!globalData.isLanding) {
					globalData.isLanding = true
					//重新获取token,再次请求接口
					getToken();
				}
			} else if (res.statusCode == 400) {
				wx.showToast({
					title: res.data,
					icon: "none"
				})
				
			} else {
				//如果有定义了params.errCallBack，则调用 params.errCallBack(res.data)
				if (params.errCallBack) {
					params.errCallBack(res);
				}
			}
			if (!globalData.isLanding) {
				wx.hideLoading();
			}
		},
		fail: function (err) {
			wx.hideLoading();
			wx.showToast({
				title: "服务器出了点小差",
				icon: "none"
			});
		}
	})
}

let wx_code;
//通过code获取token,并保存到缓存
var getToken = function () {
	
	wx.login({
		success: wxData => {
			wx_code = wxData.code
			wx.getSetting({
				success(res) {
					console.log(res, 'res000')
					if (!res.authSetting['scope.userInfo']) {
						wx.navigateTo({
							// url: '/pages/login/login',
							url: '/pages/login/login',
						})
					} else {
						Login()
					}
				},
				fail(res) {
					console.log(res, 'err000')
				}
			});
			
		}
	})
}

function Login() {
	wx.getUserInfo({
		success(res) {
			
			request({
				login: true,
				url: '/login?grant_type=mini_app',
				data: {
					principal: wx_code,
					loginType: 1,
					encryptedData: res.encryptedData,
					ivStr: res.iv
				},
				callBack:  result => {
					
					var globalData = getApp().globalData;
					var userInfo = JSON.parse(res.rawData);
					
					getApp().globalData.userInfo = result;
					 getIsTeacher({
						userId: result.userId
					})
					if (!result.pic || !result.userId) {
						updateUserInfo(userInfo)
					}
					
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
function getIsTeacher(params) {
	
	request({
		url: '/apply/getisTeacher',
		data: params,
		method: 'GET',
		callBack: (res) => {
			console.log(res.data, 'res-----')
			getApp().globalData.isTeacher = res.data;
			
		}
	})
	
}

// 更新用户头像昵称
function updateUserInfo(userInfo) {
	request({
		url: "/p/user/setUserInfo",
		method: "PUT",
		data: {
			avatarUrl: userInfo.avatarUrl,
			nickName: userInfo.nickName,
			sex: userInfo.gender
		},
		callBack: () => {
		
		}
	},);
}

//获取购物车商品数量
function getCartCount() {
	var params = {
		url: "/p/shopCart/prodCount",
		method: "GET",
		data: {},
		callBack: function (res) {
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
exports.Login = Login;

exports.http = {
	getToken, request, getCartCount, updateUserInfo, Login
}
