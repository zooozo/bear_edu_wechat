
const TIM = require('./wx-tim/tim-wx');
const types=require('./utils/types');
import { emojiName, emojiMap, emojiUrl } from './utils/emojiMap'
import Cos from './cos-wx-sdk-v5'
const app=getApp();

const tim = TIM.create({
    SDKAppID: 1400390702
})
tim.registerPlugin({'cos-wx-sdk': Cos});
tim.TYPES=types.default
tim.setLogLevel(3);
// 这是保存的消息列表
let DBCenter={
    MessageList:{},
    talkingList:{}
}

// let sig=new Generate()
// 存放要传入的参数对象
let obj={
    nextReqMessageID:null
}

// websocket派发事件
tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, (res)=>{
    // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
    // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
    // event.data - 存储 Conversation 对象的数组 - [Conversation]
    console.log('更新了会话列表')
    DBCenter.MessageList=res.data;
}, this)

tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    // event.name - TIM.EVENT.MESSAGE_RECEIVED
    // event.data - 存储 Message 对象的数组 - [Message]
    console.log('收到了新的消息')
    console.log(event,'event----')
    DBCenter.talkingList=event.data
});




let action={
    getMessageListData:function (conversationID,nextReqMessageID){
        console.log(tim,'tim============')
        return new Promise((re,rj)=>{
            tim.getMessageList({conversationID:'C2C'+conversationID,nextReqMessageID,count:15}).then(res=>{
                re(res)
            }).catch(err=>{
                rj(err)
            })
        })
        // return  new Promise((re,rj)=>{
        //
        // })

    },

    sendMsg:function (message){
        message.virtualDom = this.decodeElement(message)
        let date = new Date(message.time * 1000)
        message.newtime = this.formatTime(date)
        return message
    },
   parseText (message) {
    let renderDom = []
    let temp = message.payload.text
    let left = -1
    let right = -1
    while (temp !== '') {
        left = temp.indexOf('[')
        right = temp.indexOf(']')
        switch (left) {
            case 0:
                if (right === -1) {
                    renderDom.push({
                        name: 'span',
                        text: temp
                    })
                    temp = ''
                } else {
                    let _emoji = temp.slice(0, right + 1)
                    if (emojiMap[_emoji]) {
                        renderDom.push({
                            name: 'img',
                            src: emojiUrl + emojiMap[_emoji]
                        })
                        temp = temp.substring(right + 1)
                    } else {
                        renderDom.push({
                            name: 'span',
                            text: '['
                        })
                        temp = temp.slice(1)
                    }
                }
                break
            case -1:
                renderDom.push({
                    name: 'span',
                    text: temp
                })
                temp = ''
                break
            default:
                renderDom.push({
                    name: 'span',
                    text: temp.slice(0, left)
                })
                temp = temp.substring(left)
                break
        }
    }
    return renderDom
},
    decodeElement (message) {
        // renderDom是最终渲染的
        console.log(message,'message---')
        switch (message.type) {
            case 'TIMTextElem':
                return this.parseText(message)
            case 'TIMGroupSystemNoticeElem':
                return parseGroupSystemNotice(message)
            case 'TIMGroupTipElem':
                return parseGroupTip(message)
            case 'TIMCustomElem':
                return parseCustom(message)
            default:
                return []
        }
    },
    formatTime (date) {
        // if (this.isToday(date)) {
        //     return wx.dayjs(date).format('A HH:mm').replace('PM', '下午').replace('AM', '上午')
        // }
        return this.getDate(date)
    },
    isToday (date) {
        return date.toDateString() === new Date().toDateString()
    },
    getDate (date, splitor = '/') {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}${splitor}${this.addZeroPrefix(month)}${splitor}${this.addZeroPrefix(day)}`
    },
    addZeroPrefix (number) {
        return number < 10 ? `0${number}` : number
    }
}





tim.actions=action
tim.DBCenter=DBCenter
tim.obj=obj

export {
    tim
}