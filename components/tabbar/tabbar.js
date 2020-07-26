Component({
    /**
     * 页面的初始数据
     */
    options: {
        multipleSlots:true
    },
    data:{
        currentData: 0,
        selectPerson: true,
        scrollX:42
    },
    properties:{
        tabList:{
            type:Object,
            value:{}
        },

    },
    /**
     * 生命周期函数--监听页面加载
     */
    methods:{
        bindchange: function(e) {
            console.log(e,'sss----')
            const that = this;
            that.setData({
                currentData: e.detail.current
            })
        },

        //点击切换，滑块index赋值
        checkCurrent: function(e) {

            const that = this;
                let num=Number( e.currentTarget.dataset.current)
            if (that.data.currentData === num) {
                return false;
            } else {

                that.setData({
                    currentData: e.currentTarget.dataset.current,
                    scrollX:e.detail.x
                })
                that.triggerEvent("PostCurrentIndex", this.data.currentData);
            }
        }
    }
    //获取当前滑块的index

})