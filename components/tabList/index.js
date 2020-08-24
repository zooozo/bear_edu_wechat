const util=require('../../utils/util')

Component({
    properties: {
        tabList:Array,
        key:String,
        key1:String,

    },
    data: {
        scrollX:32,
        currentIndex:0,
    },
    methods: {
        titleClick(e){
            let index=e.currentTarget.dataset.idx;
            let that=this
            console.log('.click'+index)
            this.createSelectorQuery().selectAll('.click'+index).boundingClientRect(function (rect) {
                console.log(rect,'rect--')
                    that.setData({
                        scrollX:rect[0].left*2,//换算成rpx单位
                        currentIndex:index
                    })
            }).exec()
            console.log(this.data.currentIndex,'index---')
            this.triggerEvent("PostCurrentIndex",index);
        },
    },
    ready(){
        console.log(this.data.tabList,'list===')
    }
});
