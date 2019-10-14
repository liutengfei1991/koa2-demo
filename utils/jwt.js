const JwtToken = (app) => {
    const koajwt = require('koa-jwt');
    // jwt中间件
    app.use(koajwt({
        secret: "secret"//加密密钥，可换
    }).unless({
        path: ["/login"]//添加不需要token的接口
    }));
    // 未携带token请求接口会出错，触发这个
    // app.use(function(err, ctx, next) {
    //     console.log('-----------s-s-s-s-s--s--s---s--s----')
    //     console.log(ctx)
    //     if (err.name === "UnauthorizedError") {
    //         ctx.status(401).send(err);
    //     }
    // });
}
module.exports = JwtToken