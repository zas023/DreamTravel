// pages/authorize/authorize.js
const app = getApp();
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    //this.signupAndLogin();
    //调用API从本地缓存中获取数据
      var value = wx.getStorageSync('user_openid')
      if (value) {
      } else {
        console.log('执行login1')
        wx.login({
          success: function (res) {
            console.log('执行login2', res);
            if (res.code) {
              console.log('Bmob...');
              Bmob.User.requestOpenId(res.code, {
                success: function (userData) {
                  wx.getUserInfo({
                    success: function (result) {
                      var userInfo = result.userInfo
                      var nickName = userInfo.nickName
                      var avatarUrl = userInfo.avatarUrl
                      var gender = userInfo.gender
                      console.log('Bmob login...');
                      Bmob.User.logIn(nickName, userData.openid, {
                        success: function (user) {
                          console.log('Bmob login success...');
                          try {
                            wx.setStorageSync('user_openid', user.get('userData').openid)
                            wx.setStorageSync('user_id', user.id)
                            wx.setStorageSync('my_nick', user.get("nickname"))
                            wx.setStorageSync('my_username', user.get("username"))
                            wx.setStorageSync('my_gender', user.get("gender"))
                            wx.setStorageSync('my_avatar', user.get("touxiang"))
                          } catch (e) {
                          }
                          console.log("登录成功");
                        },
                        error: function (user, error) {
                          console.log('Bmob login error...' + error);
                          if (error.code == '101') {
                            var user = new Bmob.User();//开始注册用户
                            user.set('username', nickName);
                            user.set('password', userData.openid);
                            user.set("nickname", nickName);
                            user.set("touxiang", avatarUrl);
                            user.set("userData", userData);
                            user.set('gender', gender);
                            console.log('Bmob signup...');
                            user.signUp(null, {
                              success: function (result) {
                                console.log('注册成功');
                                try {//将返回的3rd_session存储到缓存中
                                  wx.setStorageSync('user_openid', user.get('userData').openid)
                                  wx.setStorageSync('user_id', user.id)
                                  wx.setStorageSync('my_nick', user.get("nickname"))
                                  wx.setStorageSync('my_username', user.get("username"))
                                  wx.setStorageSync('my_gender', user.get("gender"))
                                  wx.setStorageSync('my_avatar', user.get("touxiang"))
                                } catch (e) {
                                }
                              },
                              error: function (userData, error) {
                                console.log("openid=" + userData);
                                console.log(error)
                              }
                            });

                          }
                        }
                      });
                    }
                  })
                },
                error: function (error) {
                  console.log("Error: " + error.code + " " + error.message);
                }
              });
            } else {
              console.log('获取用户登录态失败1！' + res.errMsg)
            }
          },
          complete: function (e) {
            wx.navigateBack();
          }
        });
      }
  },
})