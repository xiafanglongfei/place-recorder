// miniprogram/pages/footprints/footprints.js

const app = getApp();
const DB = wx.cloud.database();
const MARKS = DB.collection('marks');

var page = {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: "",
    logged: false,
    /**
     * 标识：是否切换成地图视角。
     */
    mapView: false,
    queryResult: [],
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
        logged: true
      })
      console.log("first callof openid in footprints: ", this.data.openid);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('myMap');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onQuery();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onQuery();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.onQuery();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onQuery: function() {
    if (!this.data.openid && app.globalData.openid) {
      console.log("recall of openid in footprints: ", this.data.openid)
      this.setData({
        openid: app.globalData.openid,
        logged: true
      });
    }

    MARKS.where({
      _openid: this.data.openid
    }).skip(this.data.queryResult.length).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res);
        // console.log('[数据库] [查询记录] 成功: ', res.data)
        var temp = this.data.queryResult;
        // temp.push(res.data);    res.data 是一个数组，push操作会将res.data当成一个元素压入temp末尾
        // temp = temp.concat(res.data);       concat 才是连接两个数组的正确方法，但这样会会返回一个新的数组，容易造成内存浪费
        for (var i in res.data) {
          temp.push(res.data[i]);
        }
        this.setData({
          queryResult: temp
        });

        var markers = parseQueryResultToMarkers(temp);
        var center = getCenterPosition(markers);
        this.setData({
          markers: markers,
          mean_lat: center.latitude,
          mean_lng: center.longitude
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取足迹失败'
        })
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
  },

  changeView: function(e) {
    this.setData({
      mapView: !this.data.mapView
    });
    if (this.data.mapView) {
      this.mapCtx.includePoints({
        padding: [40, 40, 40, 40],
        points: this.data.markers,
        success: res => {
          console.log("Points have been successfully added!");
        }
      });
    }
  },
};

Page(page);

/**
 * 提取 queryResult 中结构化的数据暂存到 temp 中
 */
function parseQueryResultToMarkers(queryResult) {
  var temp = [];
  for (var i of queryResult) {
    // var t = new Object;
    // t.latitude = i.location_details.location.lat;
    // t.longitude = i.location_details.location.lng;
    // t.iconPath = "/images/location.png";
    // t.width = 20;
    // t.height = 20;
    // console.log("t", t);
    // temp.push(t);
    
    temp.push({
      latitude: i.location_details.location.lat,
      longitude: i.location_details.location.lng
    });
  }
  console.log("temp: ", temp);
  return temp;
}

/**
 * 寻找经纬度的最值与均值
 */
function getCenterPosition(markers) {
  var max_lat = -180;
  var min_lat = 180;
  var max_lng = -180;
  var min_lng = 180;
  for (var i of markers) {
    if (i.latitude > max_lat) max_lat = i.latitude;
    if (i.latitude < min_lat) min_lat = i.latitude;
    if (i.longitude > max_lng) max_lng = i.longitude;
    if (i.longitude < min_lng) min_lng = i.longitude;
  }
  var mean_lat = (max_lat + min_lat) / 2.0;
  var mean_lng = (max_lng + min_lng) / 2.0;
  return {
    latitude: mean_lat,
    longitude: mean_lng
  };
}