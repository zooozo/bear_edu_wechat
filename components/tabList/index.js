const util=require('../../utils/util')

Component({
    properties: {
        tabList:Array,
        key:String,
        key1:String,

    },
    data: {
        scrollX:15,
        currentIndex:0,
    },
    methods: {
        titleClick(e){
            let index=e.currentTarget.dataset.idx;
            let that=this

            this.createSelectorQuery().selectAll('.click'+index).boundingClientRect(function (rect) {
                console.log(rect,'rect--')
                let left=Math.ceil(rect[0].left)
                    that.setData({
                        scrollX:left,//换算成rpx单位
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
