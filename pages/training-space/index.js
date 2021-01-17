const http = require('../../utils/http')
const app = getApp();
Page({
    data: {
        commentsList: [],
        weekList: [
            // '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',
            {name: '周日', id: 7},
            {name: '周一', id: 1},
            {name: '周二', id: 2},
            {name: '周三', id: 3},
            {name: '周四', id: 4},
            {name: '周五', id: 5},
            {name: '周六', id: 6},
        ],
        skillLeave: ['业余一级', '业余二级', '业余三级'],
        teacher: {},
        commentsList:null,
        currentMomentList:[],
        showMore:false
    },
    onLoad: function (options) {
        console.log(options,'options----')
        this.getTeacherInfo(options.id);
      
    },
    tapFollow() {
        let bool=Number(!this.data.userData.attentionFlag)
        http.request({
            url: '/attention/saveUserAttention',
            data: {
                beAttentionUid: this.data.userData.userId,
                attentionFlag: bool
            },

            callBack: (res) => {
                let attentionFlag=this.data.userData.attentionFlag
               this.setData({
                   'userData.attentionFlag':!attentionFlag
               })

            }
        })
    },
    goToPayOrder(){
        wx.removeStorage({key:'trainerUser'})
        
        wx.setStorage({
            key:'trainerUser',
            data:this.data.teacher,
            success:(res)=> {
                wx.navigateTo({
                    url:'/pages/createOrder/index?type=1&teacher='+this.data.teacher,
        
                })
            }
        })
      
    },
    goToGroupOrder(e){
        let type=e.currentTarget.dataset.type
        wx.removeStorage({key:'trainerUser'})
        wx.navigateTo({
            url:'/pages/groupClassList/index?id='+this.data.teacher.userId,
        })
      
    },
    copyId() {
        app.copyData(this.data.userData.userId)
    },
    // 获取授课信息
    getTeacherInfo(id){

        console.log(this.options,app.globalData.userInfo.userId)
        http.request({
            method: 'GET',
            url: '/apply/getTeacherResume',
            data: {
                userId:id || 27
            },
            callBack: (res) => {
                console.log(res.data,'res---')
                res.data.weekTime='1,2,3,4,5,6,7'
                let week=res.data.weekTime && res.data.weekTime.split(',');
                  week.sort();
                  let arr=[]
                  week.forEach(item=>{
                       let data=this.data.weekList.find((weekCur)=>item==weekCur.id);
                       arr.push(data.name);
                  })
                  res.data.weekTime=arr.toString();
                 if(res.data.receivingType==2) res.data.orderTime=res.data.orderTime.split(',')
                  res.data.orderPrice=parseFloat(res.data.orderPrice/100)
                  let list=[];
                 list.push(res.data.yeCategoryName,res.data.parentName,res.data.categoryName)
                  this.setData({
                        skillList:list,
                        teacher:res.data,
                       
                  })
                this.getCommnetsList(id);
                 this.getGroupClassList(id);
               console.log(res,'res--')
            }
        })
    },
    getGroupClassList(id){
        http.request({
            url:'/groupClass/listTeacherClass',
            data:{  teacherId:id},
            method:'GET',
            callBack:(res)=>{
            
            }
        })
    },
    getCommnetsList(id){
           http.request({
               url:'/trainerComment/teacherComments',
               method:'GET',
               data:{
                   trainerId:id || 3
               },
               callBack:(result)=>{
                   for(let i=0;i<result.length;i++){
                       result[i].createTime=result[i].createTime.split('T').toString().replace(',','  ')
                       result[i].icons=[]
                       for(let j=0;j<result[i].stars;j++){
            
                           result[i].icons.push({
                               icon:'../../images/icon/yike.png'
                           })
                       }
                   }
                   console.log(result,'result---')
                   let arr=result
                   this.setData({
                     
                       commentsList:result,
    
                       currentMomentList:result.length>3?result.slice(3):result
                   })
                
               }
           })
    },
    showMoreList(){
        this.setData({
            showMore:!this.data.showMore,
            
        },()=>{
            if(this.data.showMore){
                this.setData({
                    currentMomentList:this.data.commentsList,
                })
            }else{
                this.setData({
                    currentMomentList:this.data.commentsList.slice(3),
                })
            }
            
           
        })
    },
    // 获取推荐列表
    onShow() {


    },
});