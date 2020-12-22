Page({
      data: {
            categoryList:[
                  {name:'文化类'},
                  {name:'艺术类'},
                  {name:'综合类'}
            ],
            activeIndex:0
      },
      onLoad: function (options) {
            this.getTimeNow();
      },
      getTimeNow(){
            let now=new Date();
            let year=now.getFullYear();
            let month=now.getMonth()+1;
            let date=now.getDate();
            this.setData({
                  TimeOfNow:year+'-'+month+'-'+date
            })
      }
});