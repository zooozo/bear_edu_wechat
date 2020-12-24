//stadium.js
//获取应用实例
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");

const app = getApp()

Page({
      data: {
            tabList: [
                  {name: '文化类', id: 1},
                  {name: '艺术类', id: 2},
                  {name: '综合类', id: 3},
            ],
            teacher:[],

            currentIndex: 0,
            ossImageTypeList: ['?x-oss-process=image/crop,x_0,y_0,w_166,h_200,north', '?x-oss-process=image/crop,x_0,y_0,w_166,h_220,north'],
            backgroundList: [
                  ['https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
                        'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'],
                  ['https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                        'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'],
            ],
            orderEntryList: [],
      },
      onLoad() {
            this.getCateGory();
      },

      getCateGory(){
        http.request({
              method: 'GET',
              url:'/bear-admin/category/categoryInfo',
              data:{
                    parentId:0
              },
              callBack(res){
                    console.log(res,'res---')
              }

        })
      },

      onShareAppMessage() {
            return {
                  title: '众羽在线',
                  path: '/pages/index/index',
                  imageUrl: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
            }
      }
})