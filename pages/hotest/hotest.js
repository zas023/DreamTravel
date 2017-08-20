// hotest.js
var Bmob = require('../../utils/bmob.js');
var app = getApp()

Page({

  data: {
    latest: [],
  },

  toDetail: function (e) {
    var id = e.currentTarget.id;
    app.requestDetailid = id;

    wx.navigateTo({
      url: '../detail/detail?id=' + this.data.latest[id].id + '&author=' + this.data.latest[id].get('author'),
    })

  },

  fetchData: function () {

    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true
    });

    var YuePai = Bmob.Object.extend("YuePai");
    var query = new Bmob.Query(YuePai);
    query.descending("mark");
    query.find({
      success: function (results) {

        var l = that.data.latest.concat(results);

        that.setData({
          latest: l,
        });
        wx.hideLoading();
      },
      error: function (error) {
        wx.hideLoading();
      }
    });
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    this.fetchData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      latest: []
    });
    this.fetchData();
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

  }
})