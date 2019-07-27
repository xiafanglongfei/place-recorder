// miniprogram/pages/footprints/footprints.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    openid: undefined,
    logged: false,

    view: false,

    location_details: undefined,

    queryResult: undefined,
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
      console.log("first callof openid in footprints: ", this.data.openid)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onQuery()
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
    this.onQuery()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onQuery: function() {
    if (!this.data.openid && app.globalData.openid) {
      console.log("recallof openid in footprints: ", this.data.openid)
      this.setData({
        openid: app.globalData.openid,
        logged: true
      })
    }

    const db = wx.cloud.database()

    db.collection('marks').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          // queryResult: JSON.stringify(res.data, null, 2)
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        // console.log('[数据库] [查询记录] 成功: ', res.data)

        var temp = new Array;
        // var t = new Object;
        // console.log("res.data.length", res.data.length)}

        for (var i of res.data) {
          var t = new Object;
          t.latitude = i.location_details.location.lat
          t.longitude = i.location_details.location.lng
          // t.iconPath = "/images/location.png"
          // t.width = 20
          // t.height = 20
          
          // console.log("t", t)
          temp.push(t)
        }

        var sum_lat = 0
        var sum_lng = 0
        for (var i of temp) {
          sum_lat += i.latitude
          sum_lng += i.longitude
        }

        var mean_lat = sum_lat / res.data.length
        var mean_lng = sum_lng / res.data.length

        console.log("temp", temp)
        console.log("mean", mean_lat, mean_lng)
        this.setData({
          markers: temp,
          mean_lat: mean_lat,
          mean_lng: mean_lng
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取足迹失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  changeView: function(e) {
    this.setData({
      view: !this.data.view
    })
    if (this.data.view) {
      // this.mapCtx.moveToLocation()
      this.mapCtx.includePoints({
        padding: [40, 40, 40, 40],
        // points: [{
        //   latitude: 23.10229,
        //   longitude: 113.3345211,
        // }, {
        //   latitude: 23.00229,
        //   longitude: 113.3345211,
        // }]
        points: this.data.markers,
        success: res => {
          console.log("Points have been successfully included!")
        }
      })
    }
  },
})