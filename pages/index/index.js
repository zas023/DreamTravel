//index.js
var common = require('../../utils/common.js')
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
const app = getApp()
var curIndex = 0;
var that;

const MENU_WIDTH_SCALE = 0.82;
const FAST_SPEED_SECOND = 300;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;

var my_nick = wx.getStorageSync('my_nick')
var my_sex = wx.getStorageSync('my_sex')
var my_avatar = wx.getStorageSync('my_avatar')
Page({
  data: {
    my_nick: my_nick,
    my_sex: my_sex,
    my_avatar: my_avatar,
    userInfo: [],
    dialog: false,
    autoplay: false,
    ui: {
      windowWidth: 0,
      menuWidth: 0,
      offsetLeft: 0,
      tStart: true
    },
    postsList: [], //总的活动
    postsShowSwiperList: [], //轮播图显示的活动
    currentPage: 0, //要跳过查询的页数
    limitPage: 3,//首先显示3条数据（之后加载时都增加3条数据，直到再次加载不够3条）
    isEmpty: false, //当前查询出来的数据是否为空
    totalCount: 0, //总活动数量
    endPage: 0, //最后一页加载多少条
    totalPage: 0, //总页数
    curIndex: 0,
    windowHeight1: 0,
    windowWidth1: 0,
  },

  //首页切换图片
  onSwiperChange: function (event) {
    curIndex = event.detail.current
    this.changeCurIndex()
  },
  changeCurIndex: function () {
    this.setData({
      curIndex: curIndex
    })
  },
  onHide: function () {
    this.setData({
      autoplay: false
    })
  },

  //到地图模式
  gotoMap: function () {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/showinmap/showinmap',
      });
    }
  },

  onLoad(t) {
    var self = this;
    try {
      let res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
      this.data.ui.offsetLeft = 0;
      this.data.ui.windowWidth = res.windowWidth;
      this.setData({ ui: this.data.ui })
    } catch (e) {
    }
  },

  onShow: function (e) {
    this.getAll();
    this.fetchTopThreePosts(); //获取轮播图的3篇文章
    this.fetchPostsData(); //加载首页信息
    //this.onLoad();
    console.log('加载头像')
    var that = this

    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth,
          autoplay: true
        })
      }
    })
  },

  //数据存储
  onSetData: function (data) {
    console.log(data.length);
    let page = this.data.currentPage + 1;
    //设置数据
    data = data || [];
    this.setData({
      postsList: page === 1 || page === undefined ? data : this.data.postsList.concat(data),
    });
    console.log(this.data.postsList, page);
  },

  //获取总的活动数
  getAll: function () {
    self = this;
    var Diary = Bmob.Object.extend("YuePai");
    var query = new Bmob.Query(Diary);
    //query.equalTo("isShow", 1); //只统计公开显示的活动
    query.count({
      success: function (count) {
        var totalPage = 0;
        var endPage = 0;
        if (count % self.data.limitPage == 0) {//如果总数的为偶数
          totalPage = parseInt(count / self.data.limitPage);
        } else {
          var lowPage = parseInt(count / self.data.limitPage);
          endPage = count - (lowPage * self.data.limitPage);
          totalPage = lowPage + 1;
        }
        self.setData({
          totalCount: count,
          endPage: endPage,
          totalPage: totalPage
        })
        console.log("共有" + count + " 条记录");
        console.log("共有" + totalPage + "页");
        console.log("最后一页加载" + endPage + "条");
      },
    });
  },

  //获取轮播图的文章,点赞数最多的前3个
  fetchTopThreePosts: function () {
    var self = this;
    var molist = new Array();
    var Diary = Bmob.Object.extend("YuePai");
    var query = new Bmob.Query(Diary);
    //query.equalTo("isShow", 1); //公开显示的
    query.descending("mark");
    query.include("user");
    query.limit(3);
    query.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          molist.push(results[i]);
        }
        self.setData({
          postsShowSwiperList: molist
        })
        //self.fetchPostsData(self.data); //加载首页信息
      },
      error: function (error) {
        console.log(error)
      }
    })
  },

  //获取首页列表文章
  fetchPostsData: function (data) {
    var self = this;
    //获取详询活动信息
    var molist = new Array();
    var YuePai = Bmob.Object.extend("YuePai");
    var query = new Bmob.Query(YuePai);
    //query.equalTo("isShow", 1); //公开显示的
    query.limit(self.data.limitPage);
    console.log(self.data.limitPage);
    query.skip(3 * self.data.currentPage);
    query.descending("createdAt"); //按照时间降序
    query.include("user");
    query.find({
      success: function (results) {
        // console.log(results[0]._serverData)
        // console.log(results[0].createdAt)
        for (var i = 0; i < results.length; i++) {
          molist.push(results[i]);
        }
        self.onSetData(molist);
        setTimeout(function () {
          wx.hideLoading();
        }, 900);
      },
      error: function (error) {
        console.log(error)
      }
    })
  },

  //加载下一页
  loadMore: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    //一秒后关闭加载提示框
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    var self = this;
    self.setData({
      currentPage: self.data.currentPage + 1
    });
    console.log("当前页" + self.data.currentPage);
    //先判断是不是最后一页
    if (self.data.currentPage + 1 == self.data.totalPage) {
      self.setData({
        isEmpty: true
      })
      if (self.data.endPage != 0) { //如果最后一页的加载不等于0
        self.setData({
          limitPage: self.data.endPage,
        })
      }
      this.fetchPostsData(self.data);
    } else {
      this.fetchPostsData(self.data);
    }
  },


  //点击刷新
  refresh: function () {
    this.setData({
      postsList: [], //总的活动
      postsShowSwiperList: [], //轮播图显示的活动
      currentPage: 0, //要跳过查询的页数
      limitPage: 3,//首先显示3条数据（之后加载时都增加3条数据，直到再次加载不够3条）
      isEmpty: false, //当前查询出来的数据是否为空
      totalCount: 0, //总活动数量
      endPage: 0, //最后一页加载多少条
      totalPage: 0, //总页数
      curIndex: 0,
      windowHeight1: 0,
      windowWidth1: 0,
    })
    this.onShow();
  },

  // 点击活动进入活动详情页面
  click_activity: function (e) {
    if (!this.buttonClicked) {
      //util.buttonClicked(this);
      console.log(e)
      let actid = e.currentTarget.dataset.actid;
      let pubid = e.currentTarget.dataset.pubid;
      let user_key = wx.getStorageSync('user_key');
      console.log(actid)
      wx.navigateTo({
        url: '/pages/detail/detail?actid=' + actid + "&pubid=" + pubid
      });
    }
  },
  //点击搜索
  click_search: function () {
    if (!this.buttonClicked) {
      //util.buttonClicked(this);
      console.log(getCurrentPages())
      wx.navigateTo({
        url: '/pages/search/search',
      });
    }
  },
 
})
