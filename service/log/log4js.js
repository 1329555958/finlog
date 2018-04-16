/**
 * Created by weichunhe on 2015/10/29.
 */
var log4js = require('log4js');
var path = require('path');
var config = require('../../config/config');
log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",
            filename: path.join(config.log_path, 'log.log'),
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        },//日期文件格式
        {
            type: "dateFile",
            filename: path.join(config.log_path, 'access.log'),
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'accessLog'
        }
    ],
    replaceConsole: true,   //替换console.log
    levels: {
        dateFileLog: 'DEBUG'
    }
});

var log = {}, file = log4js.getLogger('dateFileLog');
var access = log4js.getLogger('accessLog');

console._debug = console.debug;
log.debug = console.debug = function () {
    console._debug.apply(null, arguments);
    file.debug.apply(file, arguments);
};

console._info = console.info;
console._log = console.log;
log.info = config.info = console.log = function () {
    console._info.apply(null, arguments);
    file.info.apply(file, arguments);
};

console._warn = console.warn;
log.warn = console.warn = function () {
    console._warn.apply(null, arguments);
    file.warn.apply(file, arguments);
};

console._error = console.error;
log.error = console.error = function () {
    console._error.apply(null, arguments);
    file.error.apply(file, arguments);
};

log.access = function () {
    console._log.apply(null, arguments);
    access.info.apply(access, arguments);
};

module.exports = log;