/**
 * Created by weichunhe on 2015/11/2.
 */
var express = require('express');
var http = require('http');
var router = express.Router();
var config = require('../config/config');
var client = require('../service/client/es');
var log = require('../service/log/log4js');
var _ = require('lodash');
var moment = require('moment');
var constant = require('../service/utils/EsConstant');
var beans = require('../service/utils/beans');
var fields = require('../service/constant/logqry');
var util = require('util');
var cache = require('../service/utils/cache');
var tools = require('../service/utils/tools');
var charts = require('../service/utils/charts');
var COUNT_TYPE = charts.countTypes;
//查询字段信息
router.get('/fields', function (req, res) {
    client.indices.getMapping({
        ignoreUnavailable: true,
        allowNoIndices: false,
        index: constant.LOG_INDEX
    }, function (err, body) {
        if (err) {
            res.json(beans.newErr(err.status, err.message));
            return;
        }
        //从最近7天中取索引
        var indies = _.keys(body).sort().slice(-7);
        //取出符合条件的字段
        var allFields = [];
        _.each(indies, function (index) {
            allFields = _.union(allFields, getAllFieldsFromIndex(body[index]));
        });
        var showFields = _.intersection(allFields, fields.showFields);
        res.json({allFields: allFields, showFields: showFields});
    });
});
//从索引中获取所有字段
function getAllFieldsFromIndex(index) {
    //排除默认字段
    var types = _.keys(_.omit(index.mappings, ['_default_']));
    var properties = [], defaultProperties = _.keys(index.mappings._default_.properties);
    _.each(types, function (type) {
        properties = _.union(properties, _.keys(index.mappings[type].properties));
    });
    var allFields = _.difference(properties, defaultProperties);
    return allFields;
}

//查询
router.get('/qry', function (req, res) {
    var param = req.query;
    var condition = [];
    //构造查询条件
    if (param.condition) {
        condition = condition.concat(tools.makeMustFromCondition(param.condition));
        delete param.condition;
    }
    if (param.startTime) {
        condition.push(_.set({}, 'range.@timestamp.gte', param.startTime));
    }
    if (param.endTime) {
        condition.push(_.set({}, 'range.@timestamp.lte', param.endTime));
    }
    if (condition.length) {
        _.set(param, 'body.query.bool.must', condition);
    }
    var countType = param.countType;
    if (countType) {
        delete param.countType;
        var cfg = COUNT_TYPE.DATE_HISTOGRAM[countType];
        if (cfg) {
            _.set(param, 'body.aggs', {
                app: {
                    date_histogram: {
                        field: "@timestamp",
                        interval: cfg.interval,
                        min_doc_count: 0
                    }
                }
            });
        }
    }

    param.index = constant.LOG_INDEX;
    console.log('logqry param', util.inspect(param, {depth: 7}));
    client.es_search(param, res, function (hits, data) {
        _.each(hits.hits, function (h) {
            h._source['@timestamp'] = moment(Date.parse(h._source['@timestamp'])).format('YYYY-MM-DD HH:mm:ss,SSS');
        });
        hits.aggs = charts.formatAggData2ChartData(data, countType);
        res.json(hits);
    });
});

//加载已保存的查询
router.get('/loadQry', function (req, res) {
    var param = {
        index: constant.INDEX,
        type: constant.ES_TYPE.LOG_QRY,
        size: 20, //最多查询20条
        sort: 'id:asc'
    };
    var userId = tools.UserUtil.getUserIdFromSession(req);
    tools.UserUtil.addSearchQ(param, userId);
    client.search(param, function (err, data) {
        var qrys = [];
        if (err) {
            cache.customLogQrys(qrys, userId);
            log.error('日志查询--加载已保存查询时异常', err);
        } else {
            qrys = _.pluck(data.hits.hits, '_source');
        }
        cache.customLogQrys(qrys, userId);
        res.json(qrys);
    });
});
//删除已保存的查询
router.post('/delQry', function (req, res) {
    var id = req.body.id;
    client.delete({
        index: constant.INDEX,
        type: constant.ES_TYPE.LOG_QRY,
        id: id,
        refresh: true
    }, function (err, response) {
        if (err) {
            console.trace(err);
            log.error('日志查询--删除已保存查询时异常', err);
            res.json(beans.newErr(err.status, err.message));
        } else {
            res.json(response);
        }
    });
});
//进行查询配置保存
router.post('/savecfg', function (req, res) {
    //先判断是否存在，然后进行新建或者保存,
    //2016-09-26 改成先删除后新增，因为想删除已经存在的对象的某个属性，update做不到
    client.delete({
        index: constant.INDEX,
        type: constant.ES_TYPE.LOG_QRY,
        id: req.body.id
        //refresh: true,
        //body: req.body
    }, function (error, exists) {
        function cb(err, response) {
            var rs = response;
            if (err) {
                res.status(500);
                rs = error;
            }
            res.json(rs);
        }

        tools.UserUtil.addUserIdToDoc(req.body, tools.UserUtil.getUserIdFromSession(req));
        createCfg(req.body.id, req.body, cb);
    });
});

function createCfg(id, doc, cb) {
    client.create({
        index: constant.INDEX,
        type: constant.ES_TYPE.LOG_QRY,
        id: id,
        refresh: true,
        body: doc
    }, function (error, response) {
        cb(error, response);
    });
}


module.exports = router;