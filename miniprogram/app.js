//app.js

const _SI = require('secret-info.js')
var env

/**
 * 启动时更新
 * 马上应用最新版本
 * 函数定义形式也可以是
 * function updater() {...}
 */
var updater = function() {
  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(function(res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })

  updateManager.onUpdateReady(function() {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })

  updateManager.onUpdateFailed(function() {
    // 新版本下载失败
  })
}

// app 配置对象
var app = {
  onLaunch: function() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    updater()

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.getSystemInfo({
        success(res) {
          console.log("SystemInfo: ", res)
          env = (res.platform == "devtools") ? _SI.envID.test : _SI.envID.release
          console.log("env:", env)
        }
      })
      wx.cloud.init({
        env: env,
        traceUser: true,
      })
      console.log("wx.cloud.init success!")
    }

    // 登录，换取 openid
    wx.getStorage({
      key: 'openid',
      success: res => {
        this.globalData.openid = res.data
        console.log("wx.getStorage of openid success: ", this.globalData.openid)
      },
      fail: res => {
        console.log("openid not found!")
        this.getOpenid()
      }
    })
    // this.globalData.openid = wx.getStorageSync("openid")

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res)

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


  },

  getOpenid: function() {
    console.log("getOpenid in app.js called.")
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] res: ', res)
        console.log('[云函数] [login] res.result.openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        wx.setStorage({
          key: 'openid',
          data: res.result.openid,
        })
      },
      fail: err => {
        // console.log("调用 login 云函数失败！", err)
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  globalData: {
    userInfo: undefined,

    openid: undefined,
    logged: false,

    wgs84: undefined,
    gcj02: undefined
  }
}

/**
 * 调用 App() 函数创建实例
 * 传递的参数为 app 对象
 */
App(app)