// my.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //用当前用户判断是否已经登陆
    var currentUser = Bmob.User.current();
    this.setData({
      user: currentUser
    })
  },
  //响应点击头像事件
  bindMy: function () {
    wx.navigateTo({
      url: 'setting/setting',
    })
  },

})