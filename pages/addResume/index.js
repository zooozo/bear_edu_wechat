Page({
      data: {
            query:{}
      },
      onLoad: function (options) {

      },
      getChangeValuse(e) {
            let key = e.currentTarget.dataset.item
            this.setData({
                  [`query.${key}`]: e.detail.value
            })

      },
      submitFormData(){
            console.log(this.data.query,'-0--')
      }
});