/**
 * Created by weichunhe on 2015/11/25.
 */
var _ = require('lodash');
var util = require('util');
var client = require('../client/es');
var es_constant = require('../utils/EsConstant');
var moment = require('moment');
var count_types = {
    //APP_NAME: {
    //    halfHour: 30,
    //    fiveMin: 5
    //},
    DATE_HISTOGRAM: {
        SECOND: {
            interval: 'second',
            format: 'mm分ss秒' //moment
        },
        MIN: {
            interval: 'minute',
            format: 'HH点mm分'
        },
        HOUR: {
            interval: 'hour',
            format: 'DD日HH点'
        },
        DAY: {
            interval: 'day',
            format: 'MM月DD日'
        },
        //半小时内每分钟
        perMinInHalfHour: {
            format: 'HH点mm分',
            interval: '1m', //间隔1分钟
            range: 30 // 30分钟
        }
    }
};
/**
 * 查询图表数据
 * @param {Function} cb 使用err,resp进行回调
 */
exports.qryChartData = function (body, cb, countType) {
    client.search({
        index: es_constant.LOG_INDEX,
        searchType: 'count', //不需要查询到的文档数据
        body: body
    }, function (err, resp) {
        if (err) {
            cb(err, resp);
            return;
        }
        //取出统计数据
        var result = exports.formatAggData2ChartData(resp, countType);//生成的聚合名称
        if (resp.hits.total === 0) {
            cb(err, result);
            return;
        }

        cb(err, result);
    });
};
/**
 * 计算最近minutes时间段
 * @param {number} minutes
 * @return {object} {startTime:long,endTime:long}
 */
exports.makeTimeRange = function (minutes) {
    var range = {};
    var now = moment();
    range.endTime = now.valueOf();
    range.startTime = now.add(0 - minutes, 'm').valueOf();
    return range;
};
/**
 * 将查询到的聚合数据转换成图表展示数据
 * @param aggData
 * @param countType
 * @returns {*}
 */
exports.formatAggData2ChartData = function (aggData, countType) {
    var cfg = count_types.DATE_HISTOGRAM[countType];
    if (!aggData.aggregations) {
        return null;
    }
    var data = aggData.aggregations.app.buckets;
    var result = [];
    _.each(data, function (b) {
        //对数据进行转换时区
        result.push({x: cfg ? moment(b.key).format(cfg.format) : b.key, y: b.doc_count});
    });

    return result;
}

exports.countTypes = count_types;