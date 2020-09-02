// var poly=require('../../utils/ossPolicy')
var http = require("../../../utils/http.js");
var utils = require("../../../utils/util.js");
import {emojiName, emojiMap, emojiUrl} from '../../../plugins/utils/emojiMap'
const app=getApp();
Page({
    data:{
        list:[1,1,1,1,1,1,1],
        params:{
            momentsId:40,
            pageSize:10,
            pageNum:1
        },
        query:{
            momentsId:40,
            firstCommentUid:109,
            content:''
        },
        showData: {
            textContent: '',
            emojiName: '',
            emojiMap: '',
            emojiUrl: '',
            showEmoji: true,

        },
        userInfo:null,
        messageRecords:[],
        editorData:{

        }
    },
    onLoad(options){
        console.log(options,'options--');

        wx.getStorage({
            key:'user',
            success:(res)=> {
                console.log(res,'res====')
                this.setData({
                    userInfo:res.data,
                    'showData.emojiName': emojiName,
                    'showData.emojiMap': emojiMap,
                    'showData.emojiUrl': emojiUrl
                })
            }

        })
        // this.data.params.momentsId=Number(options.id) || this.data.userInfo.id;
        // this.data.query.momentsId=Number(options.id);
        this.getMomentsDetail();
    },
    getMomentsDetail(){
      http.request({
          url:'/moments/momentsDetail',
          method:'GET',
          data:this.data.params,
          callBack:(res)=>{
              let arr = [];
              let now = Date.now() / 1000;
              let createTime;
              res.data.records.forEach((item) => {
                  // 先换算一下时间  后端返回有距离多少个小时，和创建时间
                  createTime = new Date(item.createTime).getTime() / 1000;

                  item.timeLong = utils.formatTimeObject(now - createTime)

                  arr.push(item)
              })


            this.setData({
                messageRecords:[...this.data.messageRecords, ...res.data.records]
            })
          }
      })
    },
    getMyText(e){
        this.setData({
            'query.content':e.detail.value
        })
    },
    postMyMessage(){
        if(!this.data.query.content){
          return
        }
        http.request({
            url:'/comment/saveMomentsComment',
            data:this.data.query,
            callBack:(res)=>{
                // age: 22
                // commentCount: 0
                // createTime: "2020-09-01 17:19:47"
                // delFlag: 0
                // id: 40
                // isAttention: 0
                // isLike: 1
                // likeCount: 1
                // momentsAddress: null
                // momentsContent: "嘻嘻嘻嘻"
                // momentsImgUrl: "2020/09/7e51566f046a4b35b03893c50e369e1c.png"
                // momentsLatitude: 112.93886
                // momentsLongitude: 28.22778
                // nickName: "Rainie。"
                // pic: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJHHJRWiaUTmjJFBYvicSJuHn1ia1GTDQkvPM3ykVs9ypE8bI9lfuOG5pq60xKeib9B1bEMbCJKYT2sag/132"
                // sex: 1
                // skillLevel: 0
                // timeAgo: 17
                // timeLong: {overTime: "17:26:11", day: 0, hour: 17, min: 26, send: 11, …}
                // updateTime: "2020-09-02 09:32:07"
                // userId: 10
               this.setData({
                  'userInfo.commentCount':this.data.userInfo.commentCount+1,
                   messageRecords:[]
               })

               this.getMomentsDetail()
            }
        })
    },
    // content: "222"
    // createTime: "2020-09-02 11:11:25"
    // delFlag: 0
    // firstCommentUid: 109
    // id: 8
    // likeFlag: 1
    // momentsId: 1
    // nickName: "Rainie。"
    // pic: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJHHJRWiaUTmjJFBYvicSJuHn1ia1GTDQkvPM3ykVs9ypE8bI9lfuOG5pq60xKeib9B1bEMbCJKYT2sag/132"
    // sex: 2
    // toCommentUid: null
    // toUserUid: null
    // updateTime: "2020-09-02 11:11:25"
    TapLike(e){
        let current=e.currentTarget.dataset.current
        let like=Number(!current.likeFlag);
        http.request({
            url:'/userLike/saveUserLike',
            data:{
                momentsId:this.data.query.momentsId,
                beLikeUid:current.firstCommentUid,
                likeFlag:like
            },
            callBack:(res)=>{
                let arr=this.data.messageRecords
                let index=arr.findIndex((item)=>item.id==current.id);
                arr[index].likeFlag=like;
                // let lickCount=this.data.userInfo.likeCount
                this.setData({
                    messageRecords:arr,

                })

            }
        })
    },
    // chooseEmoji(e) {
    //     let item = e.currentTarget.dataset.current;
    //     console.log(this.editorCtx,'-------')
    //     let img=`<img src="${this.data.showData.emojiUrl + this.data.showData.emojiMap[item]}"/>`
    //     this.setEditorText(img)
    // },
    //
    // setEditorText(value){
    //     const that = this
    //     wx.createSelectorQuery().select('#editor').context(function (res) {
    //         that.editorCtx = that.data.editorData.html+value
    //         console.log(that.editorCtx,'-----')
    //     }).exec()
    // },
    // onEditorReady(value) {
    //     const that = this
    //     wx.createSelectorQuery().select('#editor').context(function (res) {
    //         that.editorCtx = res.context
    //         console.log(that.editorCtx,'-----')
    //     }).exec()
    // },
    // getEditorValue(e){
    //   let value= e.detail.delta.ops[0].insert.trim()
    //     this.setData({
    //         'editorData.html':`<text>${value}</text>`
    //     })
    //
    // },
})