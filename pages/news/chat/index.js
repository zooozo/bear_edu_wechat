import {tim} from "../../../plugins/IM_message";
import {emojiName, emojiMap, emojiUrl} from '../../../plugins/utils/emojiMap'

const util = require('../../../utils/util')
const app = getApp()
const $TIM = app.globalData.$TIM.tim;
const DBCenter = app.globalData.$TIM.tim.DBCenter


Page({
    data: {
        toUser: {},
        positionOfTop: 0,
        showData: {},
        msgData: {
            nextReqMessageID: "C2Cuser5-3939000001-34393407-0",
            isCompleted: true,
            messageList: [{
                ID: "C2Cuser5-3939000001-34393407-0",
                avatar: "",
                clientSequence: 3939000001,
                conversationID: "C2Cuser5",
                conversationSubType: undefined,
                conversationType: "C2C",
                flow: "in",
                from: "user5",
                geo: {},
                isPeerRead: false,
                isPlaceMessage: 0,
                isRead: true,
                isResend: false,
                isRevoked: false,
                isSystemMessage: false,
                nick: "",
                payload: {
                    text: "在不阿萨德浪费看见爱上了对方就暗示领导看风景阿拉山口打飞机啊阿斯顿发送到发送到发送到发斯蒂芬" +
                        "阿斯顿发送到发斯蒂芬"
                },
                priority: "Normal",
                protocol: "JSON",
                random: 34393407,
                sequence: 3939000001,
                status: "success",
                time: 1598492341,
                to: "user1",
                type: "TIMTextElem",

            }, {
                ID: "C2Cuser5-3939000001-34393407-0",
                avatar: "",
                clientSequence: 3939000001,
                conversationID: "C2Cuser5",
                conversationSubType: undefined,
                conversationType: "C2C",
                flow: "in",
                from: "user1",
                geo: {},
                isPeerRead: false,
                isPlaceMessage: 0,
                isRead: true,
                isResend: false,
                isRevoked: false,
                isSystemMessage: false,
                nick: "",
                payload: {text: "在不"},
                priority: "Normal",
                protocol: "JSON",
                random: 34393407,
                sequence: 3939000001,
                status: "success",
                time: 1598492341,
                to: "user1",
                type: "TIMTextElem",

            }, {
                ID: "C2Cuser5-3939000001-34393407-0",
                avatar: "",
                clientSequence: 3939000001,
                conversationID: "C2Cuser5",
                conversationSubType: undefined,
                conversationType: "C2C",
                flow: "in",
                from: "user5",
                geo: {},
                isPeerRead: false,
                isPlaceMessage: 0,
                isRead: true,
                isResend: false,
                isRevoked: false,
                isSystemMessage: false,
                nick: "",
                payload: {text: "在不"},
                priority: "Normal",
                protocol: "JSON",
                random: 34393407,
                sequence: 3939000001,
                status: "success",
                time: 1598492341,
                to: "user1",
                type: "TIMTextElem",

            }],

        },
        actionList: [{
            txt: '拍摄',
            icon: "../../../images/setting/photo.png"
        }, {
            txt: '图片',
            icon: "../../../images/setting/image.png"
        },
        //     {
            //     txt: '视频通话',
            //     icon: "../../../images/setting/call.png"
            // },
            {

            txt: '发送视频',
            icon: "../../../images/setting/videocall.png"
        },
        ],
        params: {
            textContent: '',
            emojiName: '',
            emojiMap: '',
            emojiUrl: '',
            showEmoji: false,
            showList:false
        }

    },
    onLoad(options) {
        if (!options.type) {
            this.setData({
                toUser: {
                    toAccount: "user1",
                    type: "C2C",


                },
                'params.emojiName': emojiName,
                'params.emojiMap': emojiMap,
                'params.emojiUrl': emojiUrl

            })
        } else {
            this.setData({
                toUser: options,
                'params.emojiName': emojiName,
                'params.emojiMap': emojiMap,
                'params.emojiUrl': emojiUrl
            })


        }
        console.log('params.emojiName', this.data.params.emojiName)
        wx.setNavigationBarTitle({
            title: this.data.toUser.toAccount
        })
        util.getDomClientRect('.talkItem').then(res => {
            this.setData({
                positionOfTop: res[0].height / 2
            })
        })
        this.getDateOfNow();
        this.getMessageListByPage();

    },
    onShow() {
        console.log(this.data.toUser)

    },
    // 时时监听收到消息的数据
    watch: function (method) {
        // let obj = DBCenter;
        Object.defineProperty(DBCenter, "talkingList", {
            configurable: true,
            enumerable: true,
            set: function (value) {
                this._obj = value;
                console.log('是否会被执行2')
                method(value);
            },
            get: function () {
                // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
                return this._obj
            }
        })
    },
    getCurrentMessage(data) {
        // app.globalData.currentConversation  当前点击的会话详情。其实就是对面那个人的信息
        console.log(app.globalData.currentConversation, 'currentConversation====')
        console.log(data, '收到的消息')
        data.virtualDom = $TIM.actions.decodeElement(data);
        // 如果是当前聊天的人发过来的就展示
        if ((data[0].conversationType + data[0].from) == app.globalData.currentConversation.conversationID) {
            this.concatMessageList(data)
        }

    },

    // 获取当前的消息列表
    getMessageListByPage() {

        $TIM.actions.getMessageListData(this.data.toUser.toAccount).then(res => {
            console.log(res, 'res----');

            res.data.messageList.forEach((item, index) => {
                res.data.messageList[index].virtualDom = $TIM.actions.decodeElement(item);
            })

            this.setData({
                "msgData": res.data
            })
            this.watch(this.getCurrentMessage)
            setTimeout(() => {
                wx.pageScrollTo({
                    scrollTop: 99999
                })
            }, 300)
        })


    },
    // 获取页面显示的时间
    getDateOfNow() {
        let now = Date.now() / 1000;
        let time = util.formatTimeObject(now);
        console.log(time, 'time---')
        this.setData({
            'showData.time': time.hour + ':' + time.min
        })
    },


    concatMessageList(arrItem) {
        let arr = this.data.msgData.messageList
        this.setData({
            "msgData.messageList": arr.concat(arrItem)
        })
        setTimeout(() => {
            wx.pageScrollTo({
                scrollTop: 99999
            })
        }, 300)
    },
    // 把当前输入的值保存下来
    getCurrentText(e) {
        this.setData({
            'params.textContent': e.detail.value
        })
    },
    // 选择表情
    chooseEmoji(e) {
        let index = e.currentTarget.dataset.current;
        let emoji = this.data.params.emojiName[index];
        this.setData({
            'params.textContent': this.data.params.textContent + emoji
        })
    },
    getVideoScrollTop(e){

    },
    getVideoStatus(e){
        // let index=e.currentTarget.dataset.video
        //
        // util.getDomClientRect('video'+index).then(res => {
        //     console.log(res,'res----')
        //     this.setData({
        //
        //     })
        // })

        if(!e.detail.fullScreen){

        }else{

        }
    },
    // 选择列表事件
    chooseActions(e) {

        let type = Number(e.currentTarget.dataset.current);
        switch (type){
            case 0:
                wx.getSetting({
                    success: function (res) {
                        if (!res.authSetting['scope.camera']) { // 无权限，跳转设置权限页面
                            wx.authorize({
                                scope: 'scope.camera',
                                success: function () {
                                    self.chooseImage('camera')
                                }
                            })
                        }
                    }});
                break;
            case 1:
                this.chooseImage('album');
                break;
            case 2:
            this.chooseVideo();
                break;
            case 3:

                break;

        }

    },
    chooseVideo(){
        let that = this
        // app.UploadMedia({media:'video',duration:20}).then(res=>{
        //     let message = $TIM.createVideoMessage({
        //         to: that.data.toUser.toAccount,
        //         conversationType: that.data.toUser.type,
        //         payload: {
        //             file: res
        //         }
        //     })
        //     let VideoMessage = $TIM.actions.sendMsg(message)
        //     $TIM.sendMessage(VideoMessage).then(res=>{
        //         console.log(res,'发送的视频')
        //         that.concatMessageList(res.data.message)
        //     })
        // })
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success (res) {
                let message = $TIM.createVideoMessage({
                    to: that.data.toUser.toAccount,
                    conversationType: that.data.toUser.type,
                    payload: {
                        file: res
                    }
                })
                let VideoMessage = $TIM.actions.sendMsg(message)
                $TIM.sendMessage(VideoMessage).then(res=>{
                    console.log(res,'发送的视频')
                    that.concatMessageList(res.data.message)
                })

            }
        })
    },
    chooseImage(name) {
        let self = this
        let message = {}
        wx.chooseImage({
            sourceType: [name],
            count: 1,
            success: function (res) {
                console.log(res,'选择的图片');
                // return ;
                message = $TIM.createImageMessage({
                    to: self.data.toUser.toAccount,
                    conversationType: self.data.toUser.type,
                    payload: {
                        file: res
                    },
                    onProgress: percent => {
                        self.percent = percent
                    }
                })

                let ImgMessage = $TIM.actions.sendMsg(message)
                console.log(ImgMessage,',,message=-===');
                $TIM.sendMessage(ImgMessage).then((res) => {
                    self.percent = 0
                    console.log(res,'res----')
                    self.concatMessageList(res.data.message)
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    },
    // 选择加号的功能列表
    showModule(e) {
        let type = e.currentTarget.dataset.type
        switch (type) {
            case 'emoji':
                this.setData({
                    'params.showEmoji': !this.data.params.showEmoji
                })
                break;
            case 'list':
                this.setData({
                    'params.showList': !this.data.params.showList
                })
        }
        wx.pageScrollTo({
            scrollTop: 99999
        })
    },
    // 档用户点击键盘确定了之后触发发送事件
    getTextContent(e) {
        // this.setData({
        //     'params.textContent':e.detail.value
        // })
        // console.log(this.data.toUser.type + 'user5');
        let query = {
            to: 'user5',
            conversationType: 'C2C',
            payload: {text: e.detail.value}
        }
        const message = $TIM.actions.sendMsg($TIM.createTextMessage(query))
        console.log(message, '发送的数据')
        $TIM.sendMessage(message).then(res => {
            // res.data.message
            this.concatMessageList(res.data.message)
            // 清空输入框
            this.setData({
                'params.textContent': ''
            })
        }).catch(err => {
            console.log(err, 'err---');
        })
    }
})