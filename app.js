//app.js
var Bmob = require("utils/bmob.js");
var common = require("utils/common.js");
const __utils = require('utils/util')
Bmob.initialize("a22827601758f1d1cd174d8bdccdc0cd", "e3f22b28497e4886709670430bb7d90c");
App({
  onLaunch: function () {
    var that = this;
    //调用系统API获取设备的信息
    wx.getSystemInfo({
      success: function (res) {
        var kScreenW = res.windowWidth / 375
        var kScreenH = res.windowHeight / 603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
      }
    })
    // //调用API从本地缓存中获取数据
    // try {
    //   var value = wx.getStorageSync('user_openid')
    //   if (value) {
    //   } else {
    //     console.log('执行login1')
    //     wx.login({
    //       success: function (res) {
    //         console.log('执行login2', res);
    //         if (res.code) {
    //           console.log('Bmob...');
    //           Bmob.User.requestOpenId(res.code, {
    //             success: function (userData) {
    //               wx.getUserInfo({
    //                 success: function (result) {
    //                   var userInfo = result.userInfo
    //                   var nickName = userInfo.nickName
    //                   var avatarUrl = userInfo.avatarUrl
    //                   var gender = userInfo.gender
    //                   console.log('Bmob login...');
    //                   Bmob.User.logIn(nickName, userData.openid, {
    //                     success: function (user) {
    //                       console.log('Bmob login success...');
    //                       try {
    //                         wx.setStorageSync('user_openid', user.get('userData').openid)
    //                         wx.setStorageSync('user_id', user.id)
    //                         wx.setStorageSync('my_nick', user.get("nickname"))
    //                         wx.setStorageSync('my_username', user.get("username"))
    //                         wx.setStorageSync('my_gender', user.get("gender"))
    //                         wx.setStorageSync('my_avatar', user.get("touxiang"))
    //                       } catch (e) {
    //                       }
    //                       console.log("登录成功");
    //                     },
    //                     error: function (user, error) {
    //                       console.log('Bmob login error...' + error);
    //                       if (error.code == '101') {
    //                         var user = new Bmob.User();//开始注册用户
    //                         user.set('username', nickName);
    //                         user.set('password', userData.openid);
    //                         user.set("nickname", nickName);
    //                         user.set("touxiang", avatarUrl);
    //                         user.set("userData", userData);
    //                         user.set('gender', gender);
    //                         console.log('Bmob signup...');
    //                         user.signUp(null, {
    //                           success: function (result) {
    //                             console.log('注册成功');
    //                             try {//将返回的3rd_session存储到缓存中
    //                               wx.setStorageSync('user_openid', user.get('userData').openid)
    //                               wx.setStorageSync('user_id', user.id)
    //                               wx.setStorageSync('my_nick', user.get("nickname"))
    //                               wx.setStorageSync('my_username', user.get("username"))
    //                               wx.setStorageSync('my_gender', user.get("gender"))
    //                               wx.setStorageSync('my_avatar', user.get("touxiang"))
    //                             } catch (e) {
    //                             }
    //                           },
    //                           error: function (userData, error) {
    //                             console.log("openid=" + userData);
    //                             console.log(error)
    //                           }
    //                         });

    //                       }
    //                     }
    //                   });
    //                 }
    //               })
    //             },
    //             error: function (error) {
    //               console.log("Error: " + error.code + " " + error.message);
    //             }
    //           });
    //         } else {
    //           console.log('获取用户登录态失败1！' + res.errMsg)
    //         }
    //       },
    //       complete: function (e) {
    //         console.log('获取用户登录态失败2！' + e)
    //       }
    //     });
    //   }
    // } catch (e) {
    //   console.log("登陆失败")
    // }
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.checkSession({
      success: function () {
      },
      fail: function () {
        //登录态过期，重新登录
        wx.login()
      }
    })
  },
  onShow: function () {

  },
  
  formate_data: function (date) {
    let month_add = date.getMonth() + 1;
    var formate_result = date.getFullYear() + '年'
      + month_add + '月'
      + date.getDate() + '日'
      + ' '
      + date.getHours() + '点'
      + date.getMinutes() + '分';
    return formate_result;
  },

  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  
  globalData: {
    userInfo: null,
  },
  onPullDownRefresh: function () {
    //wx.stopPullDownRefresh()
  },
  onError: function (msg) {
  },
  util: __utils,
})