// my.js
var Bmob = require('../../utils/bmob.js');
import { $wuxButton } from '../../components/wux'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    //----------------------------------
    index: 2,
    opened: !1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initButton();
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

  //----------------------悬浮按钮操作--------------------------------------
  initButton(position = 'bottomRight') {
    this.setData({
      opened: !1,
    })

    this.button = $wuxButton.init('br', {
      position: position,
      buttons: [
        {
          label: "添加作品",
          icon: "/images/add_work.png",
        },
        {
          label: "发布约拍",
          icon: "/images/add_post.png",
        },
      ],
      buttonClicked(index, item) {
        if (index === 0) {

        }
        else if (index === 1) {
          wx.navigateTo({
            url: '/pages/post/post',
          })
        }
        return true
      },
      callback(vm, opened) {
        vm.setData({
          opened,
        })
      },
    })
  },
  switchChange(e) {
    e.detail.value ? this.button.open() : this.button.close()
  },
  pickerChange(e) {
    const index = e.detail.value
    const position = this.data.types[index]
    this.initButton(position)
  },

})