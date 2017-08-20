// contactUS.js
var Bmob = require('../../utils/bmob.js');
Page({
  data: {
    isshow: '',
    tel: '',
    message: ''
  },
  //拨号
  boHao: function (e) {
    let newtel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: newtel
    })
  },
  //显示二维码
  showHideEwm: function () {
    let This = this;
    This.data.isshow == 'show' ? This.setData({ isshow: '' }) : This.setData({ isshow: 'show' });
  },
  //输入框聚焦时隐藏二维码
  hideEwm: function () {
    let This = this;
    This.setData({
      isshow: ''
    })
  },
  //手机号
  setInput: function (e) {
    let This = this;
    This.setData({
      tel: e.detail.value
    })
  },
  //反馈内容
  setTextarea: function (e) {
    let This = this;
    This.setData({
      message: e.detail.value
    })
  },
  //提交反馈内容
  sendMsg: function () {
    let reg = /^1\d{10}$/;
    let This = this;
    let _content = This.data.message;
    let _tel = This.data.tel.replace(/\s/ig, "");

    if (!_tel || _tel.length < 11 || !reg.test(_tel)) {
      wx.showModal({
        title: '提示',
        content: '请输入您正确的联系方式',
        showCancel: false
      })
      return;
    }
    if (!_content) {
      wx.showModal({
        title: '提示',
        content: '请输入您的反馈内容',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })

    var currentUser = Bmob.User.current();

    var LY = Bmob.Object.extend("LY");
    var ly = new LY();
    ly.set("appUser", currentUser);
    ly.set("tel", this.data.tel);
    ly.set("message", this.data.message);
    //添加数据，第一个入口参数是null
    ly.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 3000
        })
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建失败');
        wx.hideLoading();
        wx.showToast({
          title: '提交失败',
          icon: 'fail',
          duration: 3000
        })
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})