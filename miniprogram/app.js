//app.js
App({
  onLaunch: function() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.getStorage({
      key: 'openid',
      success: res => {
        this.globalData.openid = res.data
        console.log(this.globalData.openid)
      },
      fail: res => {
        this.onGetOpenid
        // console.log(this.globalData.openid)
      }
    })
    // this.globalData.openid = wx.getStorageSync("openid")

    // 获取wgs84坐标
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: res => {
        console.log("Location-wgs84", res)
        this.globalData.wgs84 = res
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    // 获取gcj02坐标
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: res => {
        console.log("Location-gcj02", res)
        this.globalData.gcj02 = res
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  globalData: {
    userInfo: {},
    hasUserInfo: false,

    openid: undefined,
    logged: false,

    wgs84: undefined,
    gcj02: undefined
  }
})