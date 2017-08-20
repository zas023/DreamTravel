// mySetting.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userGender:0,
    gender:["男","女"],
    dateValue:'',
    realName:null,
    userCity:null,
    email:null,
    genderIndex:0,
    qianming:null,
    userWechat:null,
    userQQ:null,
    userPhone:null,
  },
  //监听真实姓名
  bindRealNameInput:function(e) {
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
    console.log(e)
  },
  //监听邮箱
  bindEmailInput: function (e) {
    this.data.email = e.detail.value;
  },

  //监听个性签名
  bindQianInput:function(e){
    this.data.qianming = e.detail.value;
  },
  //监听微信号
  bindWechatInput: function (e) {
    this.data.userWechat = e.detail.value;
  },
  //监听QQ
  bindQQInput: function (e) {
    this.data.userQQ = e.detail.value;
  },
  //监听手机号
  bindPhoneInput: function (e) {
    this.data.userPhone = e.detail.value;
  },
  
  //城市选择器
  binduserCityTap: function (e) {
    // this.data.userCity = e.detail.value;
    wx.navigateTo({
      url: '../selectCity/selectCity',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //保存修改
  bindSubmit: function () {
    var that = this;
    this.setData({
      buttonLoading: true
    })
    var User = Bmob.Object.extend("_User");
    var query = new Bmob.Query(User);
    query.get(Bmob.User.current().id, {
      success: function (result) {
        console.log('点击按钮', result)
        result.set("realName", that.data.realName);
        result.set("gender", that.data.userGender);
        result.set("email", that.data.email);
        result.set("qianming", that.data.qianming);
        result.set("city", that.data.userCity);
        result.set("birthday", that.data.dateValue);
        result.set("wechatId", that.data.userWechat);
        result.set("QQ", that.data.userQQ);
        result.set("mobilePhoneNumber", that.data.userPhone);
        result.save();
        that.setData({
          buttonLoading: false
        });
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 3000
        })
      },
      error: function (object, error) {
        console.log('失败', object, error)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取原始账号信息
    var currentUser = Bmob.User.current();
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
  },
  
})