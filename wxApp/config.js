const freUrl = "http://192.168.1.106:8081/api";
const config = {
    freUrl,
    //发送短信验证码
    sendMsgUrl: `${freUrl}/wxapp/login/send`,
};

module.exports = config