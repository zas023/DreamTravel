var common = require('../template/getCode.js');
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
import { $wuxButton } from '../../components/wux'
var app = getApp();
var that;
var optionId; //活动的Id
var publisherId; //活动发布者的Id
let commentText; //评论输入框内容
Page({
  data: {
    yuepai:null,
    user:null,
    showTopTips: false, //是否显示提示
    TopTips: '', //提示的内容
    linkmainHe: false,
    linkjoinHe: false,
    //----------------
    tag_select: 0,
    limit: 5,
    showImage: false,
    loading: false,
    isdisabled: false,
    commentLoading: false,
    isdisabled1: false,
    recommentLoading: false,
    commentList: [],
    joinList: [],
    likerList: [],
    favo: 0,
    join: 0,
    isMe: false,

    status: 0,//tab切换按钮
    actionSheetHidden: true,
    actionSheetItems: ['微信号', 'QQ', '电话'],
  },

  //生成活动二维码
  showQrcode: function () {
    var path = '/pages/detail/detail?id=' + optionId + "&userid=" + publisherId;
    var width = 40;
    var that = this;
    Bmob.generateCode({ "path": path, "width": width }).then(function (obj) {
      console.log(obj);
      that.setData({
        imageBytes: obj.imageBytes,
        codeHehe: true
      })
    }, function (err) {
      common.showTip('生成二维码失败' + err);
    });
  },

  //关闭二维码弹窗
  closeCode: function () {
    this.setData({
      codeHehe: false
    })
  },

  //复制联系方式
  copyLink: function (e) {
    var value = e.target.dataset.value;
    wx.setClipboardData({
      data: value,
      success() {
        common.dataLoading("复制成功", "success");
        console.log('复制成功')
      }
    })
  },

  //切换tab操作
  changePage: function (e) {
    let id = e.target.id;
    this.setData({
      status: id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var openid = wx.getStorageSync("user_openid");
    optionId = options.id;
    publisherId = options.userid;
    var buttons2 = new Array()
    wx.getStorage({ //判断当前发布人是不是自己
      key: 'user_id',
      success: function (ress) {
        if (publisherId == ress.data) {

          that.setData({
            favo: 3, //表示无法收藏
            join: 3, //已经无法加入
            isMe: true,
          })
          console.log("这是我的发起");
        }
      },
    })
    console.log("optionId:" + optionId)
    console.log("publisherId:" + publisherId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var myInterval = setInterval(getReturn, 500);//半秒定时查询
    function getReturn() {
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval); //清除定时器
            //查询活动信息
            var YuePai = Bmob.Object.extend("YuePai");
            var query = new Bmob.Query(YuePai);
            query.include("user");
            console.log(optionId)
            query.get(optionId,{
              success: function (result) {
                if (publisherId == ress.data) {
                  that.setData({
                    isMine: true
                  })
                } 
                that.setData({
                  yuepai: result,
                  loading: true
                })
                result.set("viewNum", result.get('viewNum') + 1);
                result.save();
              },
              error: function (object,error) {
                that.setData({
                  loading: true
                })
              }
            })
          }
        },
      })
    }
  },
  //----------------------------------
  //查看发起大图
  seeActBig: function (e) {
    //console.log(e);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.id] // 需要预览的图片http链接列表
    })
  },
  //查看活动地图位置
  viewActAddress: function () {
    let latitude = this.data.latitude;
    let longitude = this.data.longitude;
    wx.openLocation({ latitude: latitude, longitude: longitude })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.listTitle);
    return {
      title: this.data.listTitle,
      path: '/pages/detail/detail?actid=' + optionId + "&pubid" + publisherId,
      imageUrl: this.data.istPic,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'fail'
        });
      }
    }
  },

  //-----------------预约与收藏------------
  //立即预约功能
  click_join: function (event) {
    var items = new Array();
    console.log(this.data.yuepai)
    var wechat = this.data.yuepai.attributes.user.wechatId;
    var qq = this.data.yuepai.attributes.user.QQ;
    var tel = this.data.yuepai.attributes.user.mobilePhoneNumber;
    items[0] = '微信号:' + wechat;
    items[1] = 'QQ:' + qq;
    items[2] = '电话:' + tel;
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden,
      actionSheetItems: items
    });
  },

  click_edit: function (event) {
    
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
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },


})