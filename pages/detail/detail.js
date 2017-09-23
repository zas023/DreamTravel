// detail.js
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    author: null,
    yuepai: null,
    user:null,
    works: [],
    BigImage:null,
    BigImageHidden:true,

    actionSheetHidden: true,
    actionSheetItems: ['微信号', 'QQ', '电话'],

    hidden: false,
    
  },

  //响应预约button
  bindReservate:function(){
    var items=new Array();
    items[0] = '微信号:' + this.data.user._serverData.wechatId;
    items[1] = 'QQ:' + this.data.user._serverData.QQ;
    items[2] = '电话:' + this.data.user._serverData.mobilePhoneNumber;
    items[3] = '长按复制'
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden,
      actionSheetItems: items
    });
  },
  //响应底部menu_cancel
  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    
  },
  //响应底部menu_item
  bindItemTap0: function (e) {
    console.log(e);
  },
  bindItemTap1: function (e) {
    console.log(e);
  },
  bindItemTap2: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.makePhoneCall({
      phoneNumber: this.data.user._serverData.mobilePhoneNumber,
      success:function(){
        console.log("拨打电话成功！")
      },
      fail:function(){
        console.log("拨打电话失败！")
      }
    })
  },

  //响应预览图片
  // clickImage: function (e) {
  //   console.log(e);
  //   this.setData({
  //     BigImage: this.data.works[0].get('image'),
  //     BigImageHidden: !this.data.BigImageHidden
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.setData({
      id: options.id,
      author: options.author
    });

    var YuePai = Bmob.Object.extend("YuePai");
    //创建查询对象，入口参数是对象类的实例
    var yuepai = new Bmob.Query(YuePai);

    yuepai.include("user");//关联数据

    yuepai.get(that.data.id, {
      success: function (result) {
        // 查询成功
        that.setData({
          yuepai: result,
          user: result._serverData.user,
        });
        result.set("mark", result.get('mark')+1);
        result.save();
      },
      error: function (object, error) {
        // 查询失败
      }
    });
    
    var Work = Bmob.Object.extend("Work");
    //创建查询对象，入口参数是对象类的实例
    var work = new Bmob.Query(Work);
    work.equalTo("author", options.author);
    //查询单条数据，第一个参数是这条数据的objectId值
    work.find({
      success: function (results) {
        that.setData({
          works: results
        });
      },
      error: function (error) {

      }
    });

    this.setData({
      hidden: true
    });

  },
})
