Component({
      properties: {
            type:Number
      },
      /*
      * 0是订单 1是优惠券 2.图文列表
      * */
      data: {
          emptyImg:['../../images/bear/order.png','../../images/bear/order.png','../../images/bear/order.png'],
          emptyText:['暂无订单','暂无优惠券','暂无信息'],
      },
      methods: {},
      ready() {
            console.log(this.data.type)
      }
});
