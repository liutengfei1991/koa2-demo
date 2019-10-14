const { ErrorModel } = require('../model/resModel')
var jwt = require("jsonwebtoken");
module.exports = async (ctx, next)=>{
    let token = ctx.headers.authorization.split(' ')[1];
    try{
        const decoded = await jwt.verify(token, 'secret')
        console.log("1--------->", decoded)
        ctx.userInfo = decoded || {}
        if(decoded && decoded.exp - Date.now() / 1000 < 0) {
            console.log('过期')
            ctx.body = new ErrorModel('登录失效')
        }
        await next();
    } catch(err) {
        ctx.body = new ErrorModel(err.name)
    }
}