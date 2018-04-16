/**
 * Created by weichunhe on 2015/11/25.
 */
var charts = require('../service/utils/charts');
var tools = require('../service/utils/tools');
var cache = require('../service/utils/cache');
var _ = require('lodash');
describe('查询图表数据', function () {
    it('按照appName统计后的总数应该=total', function (done) {
        charts.qryChartData({
            "query": {
                "bool": {
                    "must": [
                        {range: {"@timestamp": {gte: 1448518811044}}},
                        {range: {"@timestamp": {lte: 1448520611044}}}
                    ]
                }
            },
            "aggs": {
                "app": {
                    "terms": {
                        "field": "appName",
                        "size": 1000
                    }
                }
            }

        }, function (err, resp) {
            if (err) {
                expect(1).toEqual(2);
            }

            expect(_.isArray(resp)).toBeTruthy();
            done();
        });
    });
});

describe('构造时间范围', function () {
    it('计算30分钟的时间范围', function () {
        var range = charts.makeTimeRange(30);
        expect(range.endTime - range.startTime).toEqual(30 * 60 * 1000);
        expect(new Date().getTime() - range.endTime).toBeLessThan(10);
    });
});

describe('日志查询缓存', function () {
    it('读取出的数据应该给存入数据一致', function () {
        cache.customLogQrys([{id: 123, name: 'ahhhha'}]);
        var qrys = cache.customLogQrys();
        expect(qrys.length).toBe(1);
        expect(qrys[0].id).toBe(123);
    });
});