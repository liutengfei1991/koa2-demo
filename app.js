const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const Router = require('./routes')
const { REDIS_CONF } = require('./conf/db.js')
const cors = require('koa2-cors')
var JwtToken = require('./utils/jwt')

const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
	extension: 'pug'
}))

app.use(cors({
	credentials: true
}))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 访问日志----start
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
	// 测试环境
	app.use(morgan('dev'));
} else {
  const logFileName = path.join(__dirname, 'src', 'logs', 'access.log')
  
	const writeStream = fs.createWriteStream(logFileName, {
		flags: 'a'
	})
	app.use(morgan('combined', {
		stream: writeStream
	}));
}
// 访问日志----end

// session 配置
app.keys = ['Wjionl#32231']
app.use(session({
	// 配置cookie
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000
	},
	// 配置redis
	store: redisStore({
		// all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
	})
}))


// routes
Router(app)
JwtToken(app)

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app
