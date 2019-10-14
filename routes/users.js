const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
var jwt = require("jsonwebtoken");
router.prefix('/api/user')


router.post('/login', async function(ctx, next) {
    const { username, password } = ctx.request.body
	const data = await login(username, password)

    if(data.username) {
		// 加密，获取token
		var authToken = jwt.sign({
			username: username,
			password:password
		}, "secret",{
			expiresIn : 60*60*24// 授权时效24小时
		});
		ctx.body = new SuccessModel({
			token: authToken
		})
		return
	} else {}
	ctx.body = new ErrorModel({
		msg: '用户名或密码错误'
	})
});


module.exports = router
