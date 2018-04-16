/**
 * Created by weichunhe on 2015/11/26.
 */
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
var constant = require('./EsConstant');
/**
 * 日志查询 页面使用
 *  根据保存的条件生成 must 条件数组
 * @param condition
 */
exports.makeMustFromCondition = function (condition) {
    var must = [];
    _.each(condition, function (val, key) {
        //val = val.replace(/\W/g, '*');
        if (!val.replace(/\*/g, '')) {
            return;
        }
        var c = {};
        if (key === 'message') { // message 使用Lucene语法进行查询
            //https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax
            var c = _.set({}, 'query_string', {query: key + ':(' + val + ')', default_operator: 'and'});
        } else {
            var c = _.set({}, 'query.match.' + key, {query: val, type: 'phrase'});
        }
        must.push(c);
    });

    return must;
};

exports.pickSourceFromArray = function (arr) {
    var srcs = [];
    _.each(arr, function (a) {
        a['_source'] && srcs.push(a['_source']);
    });
    return srcs;
};
/**
 * 从文件中读取json数据
 * @param path 路径
 */
exports.readJSON = function (path) {
    var data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};
/**
 * 将数据保存到对应路径
 * @param path
 * @param data
 */
exports.writeJson = function (path, data) {
    fs.writeFileSync(path, JSON.stringify(data), 'utf-8');
};

/**
 * 获取某个时间的前后时间范围
 * @param time 时间字符串 '2015-12-12 12:12:12'
 * @param len 前后时间跨度,秒
 */
exports.getTimeRangeBaseOnTime = function (time, len) {
    if (_.isString(time)) {
        time = time.split(',')[0];
    }
    var middle = moment(time);
    return {startTime: middle.add(0 - len, 's').valueOf(), endTime: middle.add(len * 2, 's').valueOf()};

};

exports.getSortFieldName = function (field) {
    if (field !== '@timestamp') {
        return field + '.raw';
    }
    return field;
};
var userUtil = {};
/**
 * 获取当前session中的用户id
 * @param req
 * @returns {*}
 */
userUtil.getUserIdFromSession = function (req) {
    if (req.session && req.session[constant.USER.SESSION_KEY]) {
        return req.session[constant.USER.SESSION_KEY].loginName;
    }
    return null;
};
/**
 * 添加当前的用户信息到文档中
 * @param doc
 * @param userId
 */
userUtil.addUserIdToDoc = function (doc, userId) {
    if (userId && doc) {
        doc[constant.USER.DOC_KEY] = userId;
    }
};
/**
 * 添加用户的查询信息到search参数
 * @param param
 * @param req
 */
userUtil.addSearchQ = function (param, userId) {
    if (param && userId) {
        param.q = constant.USER.DOC_KEY + ":" + userId;
    }
};

exports.UserUtil = userUtil;

if (require.main === module) {
    console.log(exports.makeMustFromCondition({appName: '*a*', message: 'a and b'}));
}