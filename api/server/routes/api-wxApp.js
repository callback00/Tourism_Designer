const multipart = require('connect-multiparty')
const redisUtility = require('../../src/common/redisUtility');
const mobileAuth = require('../../src/controllers/wx/authController')

const tourismLogoController = require('../../src/controllers/wx/tourismLogo/tourismLogoController')

const multipartMiddleware = multipart({
    autoFiles: true,
    // maxFilesSize: 50 * 1024 * 1024, // 限制文件大小，单位：字节
  })

module.exports = (router, app, config) => {

    const loginExpired = (res) => {
        res.type = 'json';
        res.status(401).json({ error: '用户登录已过期，请重新登录!' });
    };

    // 自定义 弱权限校验 中间件
    const weakCheck = (req, res, next) => {
        redisUtility.getUser(req.sessionID, (current) => {
            if (current) {
                req.member = current;
                next();
            } else {
                loginExpired(res);
            }
        })
    }

    // 单独处理登出请求，无需权限控制，直接销毁对应的登录内容
    router.use('/wxapp/logout', (req, res) => {
        res.status(200).end()
        if (config.auth) {
            redisUtility.deleteUser(req.sessionID)
        }
    })


    // 微信 API
    router
        .post('/wxapp/login', mobileAuth.wxappLogin)
        .post('/wxapp/login/send', mobileAuth.sendCode)

    // 设计图查询
    router
        .post('/wxapp/tourismLogo/getLogoList', weakCheck, tourismLogoController.getLogoList)
        .post('/wxapp/tourismLogo/getLogoById', weakCheck, tourismLogoController.getLogoById)
        .post('/wxapp/tourismLogo/imgSearch', multipartMiddleware, weakCheck, tourismLogoController.imgSearch)
}