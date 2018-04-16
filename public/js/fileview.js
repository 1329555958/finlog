/**
 * Created by weichunhe on 2015/10/21.
 */
require('app').register.controller('FileviewController', function ($scope, $timeout, $location, $myhttp) {
    var selectFileds = ['envInfo', 'appName', 'filePath'];
    var searchParam = $location.search();
    $scope.startDate = searchParam.startTime ? new Date(searchParam.startTime - 0) : new Date();
    $scope.endDate = searchParam.endTime ? new Date(searchParam.endTime - 0) : new Date();
    $scope.selectedId = searchParam.id;

    var SelectData = {};

    _.each(selectFileds, loadSelectDataByField);
    _.each(selectFileds, makeSelect);
    _.each(selectFileds, function (field) {
        selectVal(field, searchParam[field]);
    });

    function loadSelectDataByField(filedName) {
        //加载字段统计数据
        var endTime = new Date().getTime(), startTime = endTime - 24 * 60 * 60 * 1000;
        $myhttp.get('/dashboard/countByField',
            {type: filedName, startTime: startTime, endTime: endTime},
            function (response) {
                if (response.success !== false) {
                    SelectData[filedName] = transferSelectData(response);
                }
            }, 'JSON');
    }

    //转换数组内容，使id text一样
    function transferSelectData(list) {
        return _.map(list, function (l) {
            return {id: l.x, text: l.x};
        });
    }

    //如果存在包含text的选项就返回null,否则返回新选项
    function filterSelectItem(list, text) {
        var result = _.filter(list, function (l) {
            return l.text.indexOf(text) !== -1;
        });
        if (result.length === 0) {
            result.push({id: text, text: text});
        }
        return result;
    }


    function makeSelect(fieldName) {
        $("#" + fieldName).select2({
            placeholder: "请选择或者输入",
            minimumInputLength: 1,
            query: function (query) {
                var data = {results: SelectData[fieldName] || []};
                if (query.term) {
                    if (data.results) {
                        data.results = filterSelectItem(data.results, query.term);
                    }
                }
                query.callback(data);
            },
            initSelection: function (element, callback) {
                var data = {id: element.val(), text: element.val()};
                callback(data);
            }
        });
    }

    function selectVal(fieldName, val) {
        if (val) {
            $('#' + fieldName).select2('val', val);
        } else {
            return $('#' + fieldName).select2('val');
        }
    }


    function validate() {
        return !_.find(selectFileds, function (field) {
            return !selectVal(field);
        });
    }

    function parseDate(date) {
        var now = dateUtil.parse(date) || new Date();
        return now.getTime();
    }

    function formatDate(date) {
        return dateUtil.format(date, 'yyyy-MM-dd hh:mm:ss')
    }

    /**
     * 查询数据
     * @param append 是否是追加
     * @param size 查询条数
     * @param mask 遮罩
     * @param isScrollTrigger 是否滚动触发
     */
    $scope.search = function (append, size, mask, isScrollTrigger) {
        if (!validate()) {
            if (isScrollTrigger) {
                return;
            }
            alert("请输入必填参数!");
        }
        var param = {
            body: {
                highlight: {
                    require_field_match: 'true',
                    pre_tags: ['<mark>'], post_tags: ['</mark>'], fields: {message: {a: 1}}
                }
            },
            size: angular.isNumber(size) ? size : 30
        };
        var condition = {
            //hostName: $scope.hostName,
            filePath: selectVal('filePath'),
            message: $scope.message,
            envInfo: selectVal('envInfo'),
            appName: selectVal('appName')
        };
        append = append === undefined ? false : append;
        if (append) {
            param.from = $scope.hits.hits.length;
        }
        param.startTime = parseDate($scope.startDate);
        param.endTime = parseDate($scope.endDate);
        param.condition = condition;
        param.sort = '@timestamp:asc';

        $scope.searching = mask || !append || !!size || !$scope.hits.hits;
        $scope.hasMoreHits = true;
        if (!append) {
            $scope.hits = []; //条件改变之后清空当前数据
        }
        $myhttp('searching', $scope).get('/logQry/qry', param, function (data) {
            var hits = [];
            //先处理一遍message，进行html编码，否则有可能会出现<sysdate 这种误当成html标签的情况
            if (data.hits) {
                _.each(data.hits, function (hit) {
                    hit._source.message = hit._source.message.replace(/<(\w+)/g, "< $1").replace(/(\w+)>/g, "$1 >");
                });
                _.each(_.replaceHighlightField(data.hits), function (hit) {
                    hits.push({
                        message: hit._source.message,
                        id: hit._id
                    });
                });
                data.hits = hits;
            }

            if (append) {
                $scope.hits.total = data.total;
                $scope.hits.hits = $scope.hits.hits.concat(data.hits);
            } else {
                $scope.hits = data;
                $scope.hits.hits = data.hits;
            }
            if (!$scope.hits || data.total <= $scope.hits.hits.length) {
                $scope.hasMoreHits = false;
            }
        });
    };

    if (validate()) {
        $scope.search();
    }
    //绑定滚动加载
    $scope.$on(EVENT.SCROLL_BOTTOM.broadcast, function (event, data) {
        $scope.search(true, undefined, undefined, true);
    });
    $('html, body').animate({scrollTop: 0}, 'slow');
});