var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');

var log = require('./service/log/log4js');
var routes = require('./routes/index');
var routes_es = require('./routes/elasticsearch');
var routes_warnRule = require('./routes/warnRule');
var routes_mail = require('./routes/mail');
var routes_warnErrorInfo = require('./routes/warnErrorInfo');
var routes_dashboard = require('./routes/dashboardservice');
var routes_logqry = require('./routes/logqry');
var routes_trace = require('./routes/trace');
var beans = require('./service/utils/beans');
var config = require("./config/config");
var constant = require('./service/utils/EsConstant');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//静态文件 ,放在logger上面是为了不打印 静态文件的请求日志
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('short', {
    stream: {
        write: function (msg) {
            log.access(msg);
        }
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));


//登录校验
if (config.need_login) {
    app.use(routes.doLoginCheck);
}

//路由配置
app.use('/', routes);
app.use('/es', routes_es);
app.use('/warnRule', routes_warnRule);
app.use('/warnErrorInfo', routes_warnErrorInfo);
app.use('/mail', routes_mail);
app.use('/dashboard', routes_dashboard);
app.use('/logQry', routes_logqry);
app.use('/trace', routes_trace);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//express 未能捕获的异常，线程捕获
process.on('uncaughtException', function (err) {
    log.error('Caught exception: ', err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {

        //ajax 请求
        if (req.xhr) {
            res.status(200);
            res.json(beans.newErr(err.status, err.message));
            return;
        }
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
