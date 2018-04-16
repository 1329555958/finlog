/**
 * Created by baodekang on 2015/11/3.
 */
var moment = require('moment');
var client = require('../client/es');
var ES_CONSTANT = require('../utils/EsConstant');
var _ = require('lodash');

//client.search({
//    index: 'logstash-2015.11.03',
//    body: {
//        aggregations:{
//            level:{
//                terms:{
//                    field: 'level',
//                    size: 0
//                }
//            }
//        }
//    }
//}, function(err, response){
//    console.log(response.hits.total);
//});

//client.search({
//    index: 'logstash-2015.11.03',
//    body: {
//        aggregations:{
//            level:{
//                cardinality:{
//                    field: 'level'
//                }
//            }
//        }
//    }
//}, function(err, response){
//    console.log(response.aggregations.level.value);
//});

/**
 *
 */
//var endTime = moment('2015-09-24 17:35:28').valueOf();
//var startTime = moment('2015-09-24 17:35:28').add(-10, 'minutes').valueOf();
//console.log(startTime);
//console.log(endTime);
//client.search({
//    index: 'logstash-2015.09.24',
//    body:{
//        query:{
//            bool:{
//                must:[
//                    //{
//                    //    regexp:{
//                    //        'appName':'efs-task'
//                    //    }
//                    //},
//                    {
//                        range: {
//                            '@timestamp':{
//                                'gte': startTime,
//                                'lte': endTime
//                            }
//                        }
//                    }
//                ]
//            }
//        },
//        aggregations:{
//            aggs:{
//                cardinality:{
//                    field: 'level'
//                }
//            }
//        }
//    }
//}, function(err, response){
//    console.log(response.aggregations.aggs.value);
//});

//var endTime = moment('2015-09-24 17:35:28').valueOf();
//var startTime = moment('2015-09-24 17:25:28').valueOf();
//var startTime = moment('2015-09-24 17:35:28').add() ;

//var time = moment().add(-10, 'minutes').valueOf();
//console.log(startTime);

//console.log(endTime);

//console.log(time);

//client.search({
//    index: ES_CONSTANT.INDEX,
//    type : ES_CONSTANT.ES_TYPE.WARN_RULE,
//    body : {
//        query: {
//            bool: {
//                must: [
//                    {
//                        term: {
//                            frequency: 10
//                        }
//                    },
//                    {
//                        term: {
//                            frequencyUnit: 'min'
//                        }
//                    }
//                ]
//            }
//        }
//    },
//    size : 50
//}, function (error, response) {
//    if (error) {
//        console.error(error);
//    } else {
//        var hits = response.hits.hits;
//        console.log(hits.length);
//        hits.forEach(function (hit) {
//            console.log(hit)
//        });
//    }
//});

//var endTime = moment('2015-09-24 17:35:28').valueOf();
//var startTime = moment('2015-09-24 17:35:28').add(-10, 'minutes').valueOf();
//client.search({
//    index: 'logstash-2015.09.24',
//    body:{
//        query:{
//            bool:{
//                must:[
//                    {
//                        regexp:{
//                            'appName':'.*efs-task.*'
//                        }
//                    },
//                    {
//                        range: {
//                            '@timestamp':{
//                                'gte': startTime,
//                                'lte': endTime
//                            }
//                        }
//                    }
//                ]
//            }
//        },
//        aggregations:{
//            aggs:{
//                cardinality:{
//                    field: 'appName'
//                }
//            }
//        }
//    }
//}, function(err, response){
//    console.log(response);
//});


//var endTime = moment('2015-09-24 17:35:28').valueOf();
//var startTime = moment('2015-09-24 17:35:28').add(-10, 'minutes').valueOf();
//var condition = {},
//    query = {};
//    query.bool = {};
//    query.bool.must = [];
//    query.bool.must.push({range:{'gte': startTime,'lte': endTime}});
//    if(condition){
//        for(var key in condition){
//            query.bool.must.push({regexp:{key:condition[key]}});
//        }
//    };
//console.log(query);
//client.search({
//    index: 'logstash-2015.09.24',
//    body: {
//        query:{"bool":{"must":[{"range":{"@timestamp":{"gte":1443086728000,"lte":1443087328000}}}]}},
//        aggregations:{
//            aggs:{
//                terms:{
//                    field: 'level',
//                    size: 0
//                }
//            }
//        }
//    }
//}, function(err, response){
//    if(err){
//        console.error(err.message);
//    }else{
//        console.log(response.hits.total);
//        return response.hits.total;
//    }
//});
//var from = moment('2015-11-22 17:57:07').valueOf();
//var to = moment('2015-11-26 17:57:08').valueOf();
//var query = {};
//    query.bool = {};
//    query.bool.must = [];
//query.bool.must.push({'regexp': {'warnRuleName': '.*fos.*'}})
//if(from || to){
//    var range = {};
//    range["createTime"] = {};
//    if(from){
//        range["createTime"]['gte'] = from;
//    }
//    if(to){
//        range["createTime"]['lte'] = to;
//    }
//    query.bool.must.push({"range": range});
//}
//console.log({"range" : range})
//client.search({
//    index: ES_CONSTANT.INDEX,
//    type : ES_CONSTANT.ES_TYPE.WARN_ERROR_INFO,
//    body:{
//        query:query
//    }
//}, function (err, response) {
//    if (err) {
//        console.error(err);
//    } else {
//        var hits = response.hits.hits;
//        hits.forEach(function (hit) {
//            console.log(hit._source);
//        });
//    }
//});
//
//client.search({
//    index: ES_CONSTANT.INDEX,
//    type : ES_CONSTANT.ES_TYPE.WARN_RULE,
//    body:{
//        //query:{
//        //    term:{
//        //        disabled: false
//        //    }
//        //}
//    }
//}, function (err, response) {
//    if (err) {
//        console.error(err);
//    } else {
//        var hits = response.hits.hits;
//        hits.forEach(function(hit){
//            console.log(hit);
//        });
//
//        console.log(hits.length);
//    }
//});

//console.log(new Date());

var endTime = moment('2015-09-24 17:35:28').valueOf();
var startTime = moment('2015-09-24 17:35:28').add(-10, 'minutes').valueOf();
client.search({
    index: 'logstash-2015.11.24',
    body:{
        query:{
            bool:{
                must:[
                    {
                        query_string:{
                            query: 'message: (get AND (ma OR dp*) NOT aut?)'
                        }
                    }
                ]
            }
        },
        aggregations:{
            aggs:{
                cardinality:{
                    field: 'appName'
                }
            }
        }
    }
}, function(err, response){
    var hits = response.hits.hits;
    hits.forEach(function(hit){
        console.log(hit);
    });
});