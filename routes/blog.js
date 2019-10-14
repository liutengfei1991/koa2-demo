const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
router.prefix('/api/blog')

router.get('/list', loginCheck, async function(ctx, next) {
	console.log(ctx.query)
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    if(ctx.query.isadmin) {
        // 强制查询自己的博客
        author = ctx.userInfo.username
    }
	const result = await getList(author, keyword)
	ctx.body = new SuccessModel(result)
});

module.exports = router;
