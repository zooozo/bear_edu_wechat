const http = require('../../utils/http')
const app=getApp();
Page({
    data: {
        topList: [
            {
                select: '../../images/appraise/select0.png',
                unselect: '../../images/appraise/unselect0.png',
                iconClass: 'icon1',
                iconClass1: 'icon2',
                text: '非常满意',
                textClass1: 'default',
                textClass2: 'active'
            },
            {
                select: '../../images/appraise/select1.png',
                unselect: '../../images/appraise/unselect1.png',
                iconClass: 'icon1',
                iconClass1: 'icon2',
                text: '一般',
                textClass1: 'default',
                textClass2: 'active'
            },
            {
                select: '../../images/appraise/select2.png',
                unselect: '../../images/appraise/unselect2.png',
                text: '不满意',
                iconClass: 'icon1',
                iconClass1: 'icon2',
                textClass1: 'default',
                textClass2: 'active'
            },
        ],
        CurrentEmoji: null,
        appraiseText:0,
        commentsList:[],
        chooseCommon:[],
        appraiseContent:''
    },
    onLoad: function (options) {
        this.getUserComments();

    },
    chooseAppraise(e) {
        console.log(e);
        let index = e.currentTarget.dataset.index
        this.setData({
            CurrentEmoji: index
        })
    },
    getText(e) {
        let str = e.detail.value;
        console.log(e, 'e---')
        this.setData({
            appraiseText: str.length
        })
    },
    getAppraiseText(e) {
        let str = e.detail.value;
        console.log(e, 'e---')
        this.setData({
            appraiseContent: e.detail.value
        })
    },

    getUserComments() {
        http.request({
                url: '/config/getParaConfig',
                method: 'GET',
                data: {
                    configKey: 'commentsTemplate'
                },
                callBack: (res) => {
                    this.setData({
                        commentsList:res
                    })
                }
            }
        )

    },
    chooseCommon(e){
        let index=e.currentTarget.dataset.choose;
        let arr=this.data.chooseCommon;
        let arr2=this.data.commentsList;
        let current=arr2[index].id;
        // 如果数组里面包含了这个选中的，删除选中数组里面的值

        if(arr.includes(current)){
            let findIndex=arr.findIndex(item=>item==current)

            arr2[index].delFlag=0;
            arr.splice(findIndex,1);
        }else{
            if(arr.length>=5){
                wx.showToast({
                    title:'最多只能选五个'
                })
                return
            }
            arr2[index].delFlag=1;
            arr.push(this.data.commentsList[index].id);
        }
        console.log(arr,'arr--')
        this.setData({
            chooseCommon:arr,
            commentsList:arr2
        })

    },
    toAppraise(){
        // !CurrentEmoji && chooseCommon.length==0 && appraiseText.length==0
        console.log(!this.data.CurrentEmoji,'emoji')
        if(!this.data.CurrentEmoji<0){
            wx.showToast({
                title:'请选择满意度',
                icon:"none"
            })
            return
        }
        if(this.data.appraiseText.length==0){
            wx.showToast({
                title:'请输入评价内容',
                icon:"none"
            })
            return
        }
        if(this.data.chooseCommon.length==0){
            wx.showToast({
                title:'请输入评价标签',
                icon:"none"
            })
            return
        }


        http.request({
            url:'/evaluation/saveUserEvaluation',
            data:{
                orderCode:this.options.orderCode || '1297709271030566912',
                commentUid:app.globalData.userInfo.userId,
                beCommentUid:this.options.id || 84,
                isSatisfied:this.data.CurrentEmoji,
                templateCode:this.data.chooseCommon.toString(),
                content:this.data.appraiseContent
            },
            callBack:(res)=>{
                wx.showToast({
                    title:res.msg,
                })
                setTimeout(()=>{
                    wx.navigateTo({
                        url:'/pages/order/orderIndex'
                    })
                },800)
            }
        })
    }
});