import {isNumber} from "../../vant/common/utils";

const utils=require('../../utils/util')

Page({
    data: {
        historyList:[]
    },
    onLoad: function (options) {
        let that=this;
        wx.getStorage({
            key:'history',
            success(res) {
                if(res.data.length>0){
                    let time= {},now=Date.now()/1000
                    res.data.forEach((item,index)=>{
                       time=utils.formatTimeObject(now-item.date/1000);
                        if(Number(time.min<3)){
                            item.time='刚刚'
                        } else if(Number(time.day>0)){
                            item.time=time.day+'天'
                        }else{
                            item.time=time.min+'分钟'
                        }
                    })



                    that.setData({
                        historyList:res.data
                    })
                }
            }
        })
    },
    toUserSpace(e){
        let item=e.currentTarget.dataset.current
        wx.navigateTo({
            url:'/pages/personal-space/index?userId='+item.userId
        })
    },
    clear(){
        let that=this;
        wx.showModal({
            title:'提示',
            content:'确认清除浏览记录？',
            success(state) {
                console.log(state)
                if(state.confirm){
                    wx.removeStorage({
                        key:'history',
                        success:(res)=> {

                            that.setData({
                                historyList:[]
                            })
                        }
                    })
                }

            }
        })


    }
});