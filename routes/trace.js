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
        //取出符合条件的字段
        var index = body[_.last(_.keys(body).sort())];
        var types = _.keys(_.omit(index.mappings, ['_default_']));
        var properties = [], defaultProperties = _.keys(index.mappings._default_.properties);
        _.each(types, function (type) {
            properties = _.union(properties, _.keys(index.mappings[type].properties));
        });
        var allFields = _.difference(properties, defaultProperties);
        var showFields = _.intersection(allFields, fields.showFields);
        res.json({allFields: allFields, showFields: showFields});
    });
});

//查询
router.get('/qry', function (req, res) {
    if (!req.query.chain) {
        res.json({hits: [], total: 0, message: '需要追踪chainId参数!'});
        return;
    }
    var param = {};
    var condition = [];
    //构造查询条件
    _.set(param, 'body.query.bool.must', tools.makeMustFromCondition({chainId: req.query.chain}));

    param.index = constant.TRACE_INDEX;
    console.log('trace query param', util.inspect(param, {depth: 7}));
    client.es_search(param, res, function (hits, data) {
        res.json(hits);
    });
});


module.exports = router;