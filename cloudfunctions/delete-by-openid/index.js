const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
'use strict';

exports.main = (event, context) => {
    db.collection("marks")
    .where({
      _openid: event.openid
    })
    .remove()
    .catch(res => {
      console.log(res)
      return {
        res,
        context,
      }
    })    
};