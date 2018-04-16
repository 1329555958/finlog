/**
 * Created by lijinkui on 2015/11/2.
 */

var express = require('express');
var router = express.Router();
var responseResult = require('../service/utils/ResponseResult');
var _ = require('lodash');
var util = require('util');
var client = require('../service/client/es');
var constant = require('../service/utils/EsConstant');
var charts = require('../service/utils/charts');
var moment = require('moment');
var cache = require('../service/utils/cache');
var tools = require('../service/utils/tools');
var COUNT_TYPE = charts.countTypes;
/**
 * 以json格式响应请求
 * **/
function JsonResponse(err, res) {
    result = responseResult();
    if (err) {
        result.success = false;
        result.message = err.message;
    } else {
        result.success = true;
        result.message = "success";
    }
    res.json(result);
}
/**
 * 按照appName进行日志统计
 */
router.get('/countByField', function (req, res) {
    //if (!_.chain(COUNT_TYPE.APP_NAME).keys().contains(req.query.type).value()) {
    //    JsonResponse({message: '没有此种类型的统计结果!'}, res);
    //    return;
    //}
    charts.qryChartData(countByField(req.query.type, req.query.startTime, req.query.endTime), function (err, data) {
        if (err) {
            JsonResponse(err, res);
        } else {
            res.json(data);
        }
    });
});
/**
 * 根据日期间隔查询数据
 */
router.get('/datehistogram', function (req, res) {
    if (!_.chain(COUNT_TYPE.DATE_HISTOGRAM).keys().contains(req.query.type).value()) {
        JsonResponse({message: '没有此种类型的统计结果!'}, res);
        return;
    }
    //如果是基于查询的
    var must = [];
    if (req.query.qryId) {
        var query = _.find(cache.customLogQrys(undefined, tools.UserUtil.getUserIdFromSession(req)), function (data) {
            return data.id === req.query.qryId;
        });
        //如果不存在对应的查询就返回空数据
        if (!query) {
            res.json([]);
            return;
        } else {
            must = must.concat(tools.makeMustFromCondition(query.condition));
        }
    }

    charts.qryChartData(dateHistogram(req.query.type, must, req.query.startTime, req.query.endTime), function (err, data) {
        if (err) {
            JsonResponse(err, res);
        } else {
            res.json(data);
        }
    }, req.query.type);
});

router.post('/saveCustomChart', function (req, res) {
    var id = req.body.id, doc = req.body;
    if (!id || !doc.title || !doc.qryId) {
        JsonResponse({message: '参数不完整!'}, res);
        return;
    }
    tools.UserUtil.addUserIdToDoc(doc, tools.UserUtil.getUserIdFromSession(req));
    client.create({
        index: constant.INDEX,
        type: constant.ES_TYPE.DASHBOARD,
        id: id,
        refresh: true,
        body: doc
    }, function (error, response) {
        JsonResponse(error, res);
    });
});
router.get('/getCustomChart', function (req, res) {
    var param = {
        index: constant.INDEX,
        type: constant.ES_TYPE.DASHBOARD
    };
    tools.UserUtil.addSearchQ(param, tools.UserUtil.getUserIdFromSession(req));
    client.es_search(param, res, function (hits) {
        res.json(tools.pickSourceFromArray(hits.hits));
    });
});
router.post('/deleteCustomChart', function (req, res) {
    var id = req.body.id;
    client.delete({
        index: constant.INDEX,
        type: constant.ES_TYPE.DASHBOARD,
        id: id,
        refresh: true
    }, function (err, response) {
        JsonResponse(err, res);
    });
});

function countByField(fieldName, startTime, endTime) {
    var range = {startTime: startTime, endTime: endTime};
    var body = {
        "query": {
            "bool": {
                "must": [
                    {range: {"@timestamp": {gte: range.startTime}}},
                    {range: {"@timestamp": {lte: range.endTime}}}
                ]
            }
        },
        "aggs": {
            "app": {
                "terms": {
                    "field": tools.getSortFieldName(fieldName),
                    "size": 0
                }
            }
        }
    };
    return body;
}
/**
 * 查询半小时内每分钟的日志统计
 * @param type
 * @param must 自定义查询条件
 * @returns {{query: {bool: {must: *[]}}, aggs: {app: {date_histogram: {field: string, min_doc_count: number, interval: *}}}}}
 */
function dateHistogram(type, must, startTime, endTime) {
    var cfg = COUNT_TYPE.DATE_HISTOGRAM[type];
    var range = cfg.range ? charts.makeTimeRange((cfg.range)) : {startTime: startTime, endTime: endTime};
    var body = {
        "query": {
            "bool": {
                "must": [
                    {range: {"@timestamp": {gte: range.startTime}}},
                    {range: {"@timestamp": {lte: range.endTime}}}
                ].concat(must || [])
            }
        },
        "aggs": {
            "app": {
                "date_histogram": {
                    "field": "@timestamp",
                    //"format": cfg.format,
                    "min_doc_count": 0,
                    "interval": cfg.interval
                }
            }
        }
    };
    return body;
}

module.exports = router;