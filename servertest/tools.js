/**
 * Created by weichunhe on 2015/11/26.
 */
var _ = require('lodash');
var tools = require('../service/utils/tools');
describe('通用工具方法', function () {
    it('根据condition构造must,应该包含query_string', function () {
        var condition = {appName: '*a*', message: 'bb and cc'};
        var rest = tools.makeMustFromCondition(condition);
        expect(rest.length).toEqual(2);
        _.each(rest, function (m) {
            if (m.query_string) {
                expect(_.contains(m.query_string.query, condition.message)).toBeTruthy();
            }
            if (m.wildcard) {
                expect(m.wildcard.appName).toEqual(condition.appName);
            }
        });
    });

    it('null 摘取source应该返回空数组', function () {
        expect(tools.pickSourceFromArray(null).length).toBe(0);
    });

    it('摘取source', function () {
        expect(tools.pickSourceFromArray([{_source: 11}])[0]).toBe(11);
    })

    it('根据时间点构造时间范围', function () {
        var time = '2015-11-30 13:48:43,000';
        var range = tools.getTimeRangeBaseOnTime(time, 10);
        expect(range.endTime - range.startTime).toBe(10 * 2 * 1000);
    });
});

var a = {
    "_index": "logstash-2015.11.27",
    "_type": "file",
    "_id": "AVFHa4_TGivNevoCbiS7",
    "_version": 1,
    "found": true,
    "_source": {
        "message": "[INFO ] 2015-11-27 13:26:55,621 [org.springframework.scheduling.quartz.SchedulerFactoryBean#0_Worker-7] method:com.netfinworks.csa.core.biz.manager.config.AppConfig.getText(AppConfig.java:243)\nAppConfig                                Get                                      MAILER_COMPENSATION_TEXT_TEMPLATE=\r\n#set($task = $ctx.task)\n#set($def = $ctx.def)\n\n\n#macro( cp_tr_1 $l $r)\n<tr>\n\t<td width=\"10%\" style=\"border: black solid; border-width: 1px; font: bold;\">$l</td>\n\t<td width=\"30%\" style=\"border: black solid; border-width: 1px; font: bold;\">$r</td>\n</tr>\n#end\n\n#macro( cp_tr_2 $l $r)\n<tr>\n    <td width=\"10%\" style=\"border: black solid; border-width: 1px\">$l</td>\n    <td width=\"30%\" style=\"border: black solid; border-width: 1px\">$r</td>\n</tr>\n#end\n\n\n<html>\n<body>\n\t<table style=\"border: black solid; border-width: 2px\">\n\t\t#cp_tr_1(\"补单结果\" \"目标标识\")\n\t\t#foreach( $stat in $stats.entrySet())\n        #cp_tr_2($stat.key $stat.value)\n        #end\n\t</table>\n</body>\n</html>\n\n",
        "tags": ["_jsonparsefailure"],
        "@version": "1",
        "@timestamp": "2015-11-27T05:26:55.000Z",
        "level": "INFO",
        "type": "file",
        "filePath": "/opt/logs/csa/app/csa-daemon.log",
        "envInfo": "func56",
        "appName": "csa-web",
        "hostName": "dev21520"
    }
};