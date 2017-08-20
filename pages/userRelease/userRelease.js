var Bmob = require('../../utils/bmob.js');
var app = getApp()

Page({

  data: {
    latest: [],
    author:'',
    hidden: false,
  },

  toDetail: function (e) {
    var id = e.currentTarget.id;
    app.requestDetailid = id;

    wx.redirectTo({
      url: '../detail/detail?id=' + this.data.latest[id].id + '&author=' + this.data.latest[id].get('author'),
    })

  },

  fetchData: function () {

    var that = this;
    that.setData({
      hidden: false
    })

    var YuePai = Bmob.Object.extend("YuePai");
    var query = new Bmob.Query(YuePai);
    query.equalTo("author", that.data.author);
    query.descending("updatedAt");
    query.find({
      success: function (results) {

        var l = that.data.latest.concat(results);

        that.setData({
          latest: l, hidden: true
        });

      },
      error: function (error) {
        that.setData({
          hidden: true
        });
      }
    });
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    this.setData({
      author: options.username
    });
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