// miniprogram/pages/test/test.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    
    gcj02: {},

    name: undefined,
    address: undefined,
    x: undefined,
    y: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.gcj02) {
      // console.log("test页面读取全局变量，成功")
      this.setData({
        // x: app.globalData.gcj02_longitude,
        // y: app.globalData.gcj02_latitude,
        gcj02: app.globalData.gcj02,
        flag: true
      })
      console.log("test页面读取全局变量，成功")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  getLocation: function(e) {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: res => {
        console.log("Location is ", res)
        this.setData({
          gcj02: res,
          flag: true
        })
        app.globalData.gcj02 = res
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  openLocation: function(e) {
    wx.openLocation({
      latitude: this.data.gcj02.latitude,
      longitude: this.data.gcj02.longitude,
      scale: '',
      name: '',
      address: '江苏南京',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  chooseLocation: function(e) {
    wx.chooseLocation({
      success: res => {
        this.setData({
          name: res.name,
          address: res.address,
          x: res.longitude,
          y: res.latitude
        })
      },
    })
  }
})