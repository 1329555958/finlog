var express = require('express');
var router = express.Router();
var config = require('../config/config');
var constant = require('../service/utils/EsConstant');
var http = require('http');

router.get('/', function (req, res, next) {
    var url = '/index';
    if (req.headers.host.startsWith('localhost')) { //本地请求就使用home，非压缩版本
        url = '/home';
    }

    res.redirect(url);
});

router.get('/logout', function (req, res, next) {
    var logoutUrl = req.session[constant.USER.LOGOUT_URL_KEY] || req.cookies.logoutUrl || (config.guardian.logout_url + '?token=' + req.cookies[config.guardian.cookie_key]);
    req.session[constant.USER.SESSION_LOGIN_TIME_KEY] = 0; //清除缓存登录时间

    console.log('logouturl', logoutUrl);
    if (logoutUrl) {
        http.get(logoutUrl, function (resp) {
            console.log('logout success!');
            toLogin(res, req);
        }).on('error', function (e) {
            toLogin(res, req);
            console.log('logout error', e);
        });
    } else {
        toLogin(res, req);
    }
});

/* GET home page. */
router.get(/^\/(home|index)$/, function (req, res, next) {
    res.sendFile(config.home_page);
});


function toLogin(res, req) {
    var url = config.guardian.login_url;
    if (config.guardian.return_url && url.indexOf('returnUrl') === -1) {
        url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'returnUrl=' + config.guardian.return_url;
    }
    if (req.xhr) {
        res.status(500).send('redirect:' + url);
    } else {
        res.redirect(url);
    }
}
router.doLoginCheck = function (req, res, next) {
    var token = req.cookies[config.guardian.cookie_key];
    var guardian = req.query[config.guardian.cookie_key];
    if (!token && !guardian) {
        toLogin(res, req);
    } else if (guardian) { //刚登陆回来
        res.cookie(config.guardian.cookie_key, guardian, {httpOnly: true});
        var logoutUrl = config.guardian.logout_url + '?token=' + guardian;
        res.cookie('logout_url', logoutUrl);
        console.log('logout_url', logoutUrl);
        req.session[constant.USER.LOGOUT_URL_KEY] = logoutUrl;
        res.redirect('/');
    } else if (token) { //已经登录过
        //判断session是否超时
        var loginTime = req.session[constant.USER.SESSION_LOGIN_TIME_KEY];
        if (loginTime && ( new Date().getTime() - loginTime < constant.USER.SESSION_TIMEOUT_MS)) {
            next();
            return;
        }
        //查询用户,为了判断当前用户会话是否依然有效
        http.get(config.guardian.session_url + '?token=' + token + '&timestamp=' + (new Date().getTime()), function (resp) {
            try {
                resp.setEncoding('utf8');
                resp.on('data', function (result) {
                    console.log("guardian: " + result);
                    result = JSON.parse(result);
                    if (result.code === 'success') {
                        res.cookie('user', JSON.stringify(result.data));
                        req.session[constant.USER.SESSION_KEY] = result.data;
                        req.session[constant.USER.SESSION_LOGIN_TIME_KEY] = new Date().getTime();
                        next();
                    } else {
                        toLogin(res, req);
                    }
                });
            } catch (e) {
                toLogin(res, req);
            }

        }).on('error', function (e) {
            toLogin(res, req);
        });

    }
};

module.exports = router;
