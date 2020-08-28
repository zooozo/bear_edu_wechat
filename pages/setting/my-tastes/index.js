Page({
    data: {
        list:[
            {name:'羽毛球',select:false},
            {name:'乒乓球',select:false},
            {name:'篮球',select:false},
            {name:'橄榄球',select:false},
            {name:'网球',select:false},
            {name:'足球',select:false},
        ]
    },
    onLoad: function (options) {

    },
    chooseItem(e){
        let index=e.currentTarget.dataset.current
        let arr=this.data.list;
        arr[index].select=!arr[index].select;
        this.setData({
            list:arr
        })
    },
    chooseOk(){
        let arr=this.data.list;
        let chooseArr=[]
        arr.forEach((item)=>{
            if(item.select){
                chooseArr.push(item.name)
            }
        });

        if(chooseArr.length==0){
            wx.showToast({
                title:'请最少选择一项',
                icon:'none'
            })
        }else{

            wx.getStorage({
                key: 'listData',
                success(res) {
                    wx.setStorage({
                        key: 'listData',
                        data: Object.assign(res.data, {
                            userInterest:chooseArr.toString()
                        }),
                        success(res) {
                            wx.navigateTo({
                                url: '../index'
                            })
                        }
                    })
                }
            })
        }
    }
});