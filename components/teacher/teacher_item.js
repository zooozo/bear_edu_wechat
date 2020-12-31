

Component({
      properties: {
            teacher:Array,
      },
      data: {

      },
      methods: {
            toTeacherDetail(e){
                  let item=e.currentTarget.dataset.item
                  wx.navigateTo({
                        url:'/pages/training-space/index?id='+item.userId
                  })
            },
            
      },
      ready() {
            console.log(this.data.teacher,'teacher--')
      }
});
