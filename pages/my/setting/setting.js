// pages/my/setting/setting.js
var Bmob = require('../../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userGender: 0,
    gender: ["男", "女"],
    dateValue: '',
    realName: null,
    userCity: null,
    email: null,
    genderIndex: 0,
    qianming: null,
    userWechat: null,
    userQQ: null,
    userPhone: null,
    buttonLoading: false
  },
  //监听真实姓名
  bindRealNameInput: function (e) {
    this.data.realName = e.detail.value;
  },
  //监听性别
  bindGenderChange: function (e) {
    this.setData({
      genderIndex: e.detail.value,
      userGender: this.data.entryYearIndex
    })
  },
  //监听生日
  datePickerBindchange: function (e) {
    this.setData({
      dateValue: e.detail.value
    })
  },
  //监听邮箱
  bindEmailInput: function (e) {
    this.data.email = e.detail.value;
  },

  //监听个性签名
  bindQianInput: function (e) {
    this.data.qianming = e.detail.value;
  },
  //监听微信号
  bindWechatInput: function (e) {
    //采用setData的方法能实时更新wxml中的数据
    this.setData({
      userWechat: e.detail.value
    })
    // this.data.userWechat = e.detail.value;
  },
  //监听QQ
  bindQQInput: function (e) {
    this.setData({
      userQQ: e.detail.value
    })
    // this.data.userQQ = e.detail.value;
  },
  //监听手机号
  bindPhoneInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
    // this.data.userPhone = e.detail.value;
  },

  //城市选择器
  binduserCityTap: function (e) {
    wx.navigateTo({
      url: '../selectCity/selectCity',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //保存修改
  bindSubmit: function () {
    //保存修改按钮显示加载动画
    var that = this;
    this.setData({
      buttonLoading: true
    })
    //将变更信息添加到当前用户
    var result = Bmob.User.current();
    result.set("realName", that.data.realName);
    result.set("gender", that.data.userGender);
    result.set("email", that.data.email);
    result.set("qianming", that.data.qianming);
    result.set("city", that.data.userCity);
    result.set("birthday", that.data.dateValue);
    result.set("wechatId", that.data.userWechat);
    result.set("QQ", that.data.userQQ);
    result.set("mobilePhoneNumber", that.data.userPhone);
    //保存对当前用户的修改
    result.save(null, {
      success: function (result) {
        that.setData({
          buttonLoading: false
        });
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取原始账号信息
    var currentUser = Bmob.User.current();
    if (!currentUser) {
      wx.showModal({
        title: '提示',
        content: '请先登陆',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({

            });
          }
        }
      });
    }
    //设置初始数据，将用户原有数据填入表单
    this.setData({
      user: currentUser,
      userGender: currentUser.get("gender"),
      realName: currentUser.get("realName"),
      email: currentUser.get("email"),
      dateValue: currentUser.get("birthday"),
      userWechat: currentUser.get("wechatId"),
      userQQ: currentUser.get("QQ"),
      userPhone: currentUser.get("mobilePhoneNumber"),
      qianming: currentUser.get("qianming"),
      userCity: currentUser.get("city"),
    })
    console.log(this.data.userWechat)
    console.log(this.data.userQQ)
    console.log(this.data.userPhone)
  },

})