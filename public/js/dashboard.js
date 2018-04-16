/**
 * Created by weichunhe on 2015/10/22.
 */
require('./app').register.controller('dashboardSubController', function ($scope, $myhttp, $timeout) {
    $scope.showAdd = function () {
        $('#addDialog').show();
    };
    function hideDlg() {
        $("div.modal").hide()
    }
    //统计时间间隔
    $scope.timeIntervals = [{
        name:'秒',value:'SECOND'
    },{
        name:'分钟',value:'MIN'
    },{
        name:'小时',value:'HOUR'
    },{
        name:'天',value:'DAY'
    }];

    $("button.btn.btn-box-tool").bind("click", hideDlg);
    var countByFieldUrl = '/dashboard/countByField', dateHistogramUrl = '/dashboard/datehistogram';

    var _timeslot = APP.getCurrentTimeslot();
    $scope.$on(EVENT.CONDITION_CHANGE.broadcast, function (event, data) {
        _timeslot = data;
        _timeslot.value = _timeslot.timeSlot;

        if ($scope.customCharts) {
            var charts = $scope.customCharts;
            _.each(charts, function (chart) {
                chart.timeslotUnit = null;
            });
            qryCustomChartsCB(charts);
        }
        _.each($scope.defaultCharts, function (chart) {
            $scope.refreshDefaultChart(chart);
        });
    });

    $scope.loading = {}; //保存加载状态

    $scope.isSameTimeslotUnit = function (chartUnit, unit) {
        return chartUnit ? chartUnit == unit : getTimeslotUnit() == unit;
    };
    function getTimeslotUnit() {
        return _timeslot.unit;
    }
    $scope.getTimeslotUnit = getTimeslotUnit;

        /**
     * 查询图表数据
     * @param url 路径
     * @param type 类型
     * @param dataProp 查询之后将数据放在$scope上的属性名
     * @param qryId 如果是基于查询的图表就会有查询id
     */
    function getChartData(url, type, dataProp, qryId) {
        if ($scope.closedChart[dataProp]) {
            return;
        }
        var timeRange = APP.getCurrentTimeRange(_timeslot);
        $scope.loading[dataProp] = true;
        $myhttp(dataProp, $scope.loading).get(
            url,
            {type: type || getTimeslotUnit(), qryId: qryId, startTime: timeRange.startTime, endTime: timeRange.endTime},
            function (response) {
                if (response.success === false) {
                    alert(response.message);
                } else {
                    $scope[dataProp] = response;
                }
            }, 'JSON');
    }


    $scope.halfHourData = [];
    //$scope.fiveMinData = [];
    $scope.dateHistogramData = [];

    //自定义图表--------------------------------------------------------------------------------------------------------
    $scope.customQrys = [];
    $scope.selectedQry = '';

    $scope.customCharts = [];
    $scope.defaultCharts = []; //预定义图表
    $scope.closedChart = angular.store('closedChart') || {};

    function initDefaultCharts() {
        $scope.defaultCharts = [];
        $scope.defaultCharts.push({
            name: '基于字段统计日志总数',
            id: 'halfHourData',
            dataUrl: countByFieldUrl,
            type: 'appName',
            chartType:'countByField'
        });
        //$scope.defaultCharts.push({
        //    name: '最近5分钟各APP的日志总数',
        //    id: 'fiveMinData',
        //    dataUrl: countByFieldUrl,
        //    type: 'fiveMin'
        //});
        $scope.defaultCharts.push({
            name: '最近半小时内每分钟的日志总数',
            id: 'dateHistogramData',
            dataUrl: dateHistogramUrl,
            //type: 'perMinInHalfHour',
            chartType:'dateHistogram'
        });
        _.each($scope.defaultCharts, $scope.refreshDefaultChart);
    }

    $scope.refreshDefaultChart = function (chart) {
        getChartData(chart.dataUrl, chart.type, chart.id);
    };

    $scope.refreshCustomChart = function (chart) {
        getChartData(dateHistogramUrl, chart.timeslotUnit, chart.id, chart.qryId);
    };
    /**
     * 改变图表可见性
     * @param id
     * @param visible boolean
     */
    $scope.chartVisible = function (id, visible) {
        $scope.closedChart[id] = !visible;
        angular.store('closedChart', $scope.closedChart);
    };
    $scope.reopenClosedChart = function () {
        var chartIds = _.keys($scope.closedChart);
        $scope.closedChart = {};
        angular.store('closedChart', $scope.closedChart);
        if (!chartIds.length) {
            alert("当前无已关闭的图表!");
            return;
        }
        _.each(chartIds, function (id) {
            refreshChartById(id);
        });

    };

    /**
     * 从默认图表或者是自定义图表中查找
     * @param id
     */
    function refreshChartById(id) {
        var chart = _.find($scope.defaultCharts, function (c) {
            return c.id === id;
        });
        if (chart) {
            $scope.refreshDefaultChart(chart);
        } else {
            chart = _.find($scope.customCharts, function (c) {
                return c.id === id;
            });
            chart && $scope.refreshCustomChart(chart);
        }
    }

    /**
     * 查询自定义图表
     * [{"qryId":"tab_1448528949610_1","id":"chart_1448529032427_2","title":"最近半小时每分钟的日志总数,基于查询:新建查询"}]
     */
    function qryCustomCharts() {
        return $myhttp.get('/dashboard/getCustomChart');
    }

    function qryCustomChartsCB(data) {
        $scope.customCharts = [];
        addCustomCharts(data);
    }

    function addCustomCharts(charts) {
        var newCharts = [];
        //删除 基础查询不存在的 图表配置
        _.each(charts, function (chart) {
            var q = _.find($scope.customQrys, function (qry) {
                return qry.id === chart.qryId;
            });
            if (q) {
                chart.qryName = q.name;
                newCharts.push(chart);
                $scope.customCharts.push(chart);
            } else { //进行删除
                delCustomChart(chart.id);
            }
        });
        getCustomChartsData(newCharts);
    }

    /**
     * 根据id删除自定义图表
     * @param id
     */
    function delCustomChart(id) {
        $myhttp.post('/dashboard/deleteCustomChart', JSON.stringify({id: id}), function () {
            console.info('删除图表成功!' + id);
        });
    }

    /**
     * 获取基于自定义查询的图表数据
     * @param charts
     */
    function getCustomChartsData(charts) {
        if (charts.id) { //单个图表
            charts = [charts];
        }
        if (!_.isArray(charts)) {
            return;
        }
        _.each(charts, $scope.refreshCustomChart);
    }

    /**
     * 查询自定义保存的查询
     * [{"id":"tab_1448584930499_1","name":"新建查询","condition":{},"allFields":["appName","hostName","envInfo","level","message","type","filePath"],"showFields":[],"sort":{"field":"@timestamp","type":"desc"}}]
     */
    function qryCustomQrys() {
        return $myhttp.get('/logQry/loadQry');
    }

    function qryCustomQrysCB(data) {
        $scope.customQrys = data;
    }

    //添加自定义图表
    $scope.addCustomChart = function () {
        var qryId = $scope.selectedQry;
        var qry = _.find($scope.customQrys, function (c) {
            return c.id === qryId;
        });
        if (!qry) {
            alert('不存在此查询!');
            return;
        }
        var chart = _.find($scope.customCharts, function (c) {
            return c.qryId === qryId;
        });
        if (chart) {
            alert('基于此查询的图表已经存在!');
            return;
        }
        var custom = {qryId: qryId};
        custom.id = _.makeUniqueId('chart');
        custom.title = '最近半小时每分钟的日志总数,基于查询:' + qry.name;
        hideDlg();
        $myhttp.post('/dashboard/saveCustomChart', JSON.stringify(custom), function (data) {
            console.info('保存自定义图表', data);
        });
        addCustomCharts([custom]);
    };
    //关闭图表 [并删除]
    $scope.closeCustomChart = function (id, del) {
        if (del) {
            if (confirm("确定删除此图表吗?")) {
                delCustomChart(id);
            } else {
                return;
            }
        }
        $scope.chartVisible(id, false);

    };

    function queryFields() {
        return $myhttp.get('/logqry/fields')
    }

    $.when(qryCustomQrys(), qryCustomCharts(), queryFields()).done(function (a, b, c) {
        $scope.allFields = _.filter(c[0].allFields, function (f) {
            return f !== 'message'; // message 不用于统计
        });

        qryCustomQrysCB.apply(null, a);
        qryCustomChartsCB.apply(null, b);

        initDefaultCharts();
    });
});
require('./app').register.controller('dashboardController', function ($scope, $myhttp) {
    $scope.tabPage = '/public/views/dashboard_sub.html';

    $scope.tabConfig = {
        newTabName: '仪表盘',
        tabs: [],//已保存的查询
        templateUrl: $scope.tabPage,
        saveCallback: function (tab) {
            var tagEntity = {id: tab.id, name: tab.name, $$hashKey: tab.$$hashKey};
            $myhttp.post('/dashboard/tag/saveOrUpdate', JSON.stringify(tagEntity), function (response) {
                if (!response.success) {
                    alert(response.message);
                }
            });
        },
        delCallback: function (tab) {
            var tag = {tagId: tab.id};
            $myhttp.post('/dashboard/tag/delete', JSON.stringify(tag), function (response) {
                if (!response.success) {
                    alert(response.message);
                }
            });
        }
    };

});


