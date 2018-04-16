/**
 * Created by baodekang on 2015/10/28.
 */
var ES_CONSTANT = ES_CONSTANT || {};

ES_CONSTANT = {
    INDEX: 'finlog', //自定义数据 索引
    LOG_INDEX: 'logstash-*', //日志数据 索引
    TRACE_INDEX: 'trace-*',
    INDEX_FORMAT: 'YYYY-MM-DD',//索引格式化
    ES_TYPE: {
        WARN_RULE: 'warnRule',
        DASHBOARD: 'dashboard',
        LOG_QRY: 'logqry',
        WARN_ERROR_INFO: 'warnErrorInfo'
    },
    USER: {
        LOGOUT_URL_KEY: '_logout_url',//退出地址
        SESSION_TIMEOUT_MS: 5 * 60 * 1000, //session缓存超时时间,5分钟
        SESSION_LOGIN_TIME_KEY: '_login_time', //登录时间在session中的key
        SESSION_KEY: '_user',//在session中的属性名
        DOC_KEY: '_user' //在es存储文档中的用户属性名
    }
};

module.exports = ES_CONSTANT;
