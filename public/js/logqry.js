/**
 * Created by weichunhe on 2015/10/22.
 * 日志查询
 */
require('app').register.controller('logqryTabController', function ($scope, $myhttp, $timeout, $location, $rootScope) {
    var selectFileds = $scope.selectFileds = ['envInfo', 'appName', 'filePath'];
    var SelectData = {};
    $scope.ID_SUFFIX = _.uniqueId('_');

    _.each(selectFileds, loadSelectDataByField);
    //_.each(selectFileds, );

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
        selectDom(fieldName).select2({
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
        }).on("select2-close", function () {
                var field = $scope.currentSelectFiled;
                $scope.condition[field] = selectVal(field);
            })
            .on("select2-blur", function () {
                $scope.currentSelectFiled = '';
                $scope.$digest();
            });
    }

    function selectVal(fieldName, val) {
        if (val) {
            selectDom(fieldName).select2('val', val);
        } else {
            return selectDom(fieldName).select2('val');
        }
    }

    function selectDom(fieldName){
        return $("#"+fieldName+$scope.ID_SUFFIX);
    }

    $scope.currentSelectFiled = '';
    $scope.isSelectField = function (field) {
        return _.contains($scope.selectFileds, field);
    };

    $scope.showSelect = function (field) {
        if (!$scope.isSelectField(field)) {
            return;
        }
        makeSelect(field);
        if ($scope.condition[field] !== undefined) {
            selectVal(field, $scope.condition[field]);
        }
        $scope.currentSelectFiled = field;
    };
    //获取当前标签id
    var TabId = null;
    $('.tab-pane>.ng-scope').each(function () {
        var s = angular.element(this).scope();
        if (s.$id === $scope.$id) {
            TabId = $(this).parent('.tab-pane').attr('id');
        }
    });

    //加载事件
    var loadCfgDef = $.Deferred(), timeRangeDef = $.Deferred();

    //var fieldData = {}; //保存查询到的字段数据
    var configData = {
        id: '', //配置 信息标识
        condition: {}, //已选条件
        showFields: []//选择显示的字段
        //sort: {field:,type:}
    }; //配置信息
    $scope.conditonChangeToSearch = false;
    $scope.maxLengthField = ''; //保存最长字段，用于使options显示长度相同
    $scope.fieldSet = []; //能用于条件 的字段集
    $scope.hits = {hits: [], aggs: []}; //查询到的数据
    //要显示的字段
    var def_show_field = [],
        allFields = []; //字段查询后放入

    function reset() {
        $scope.condition = {};
        $scope.addedConds = [];
        $scope.hasCond = true; //还有添加可以添加
    }

    reset();

    var eventName = 'OnReceive' + TabId;
    $scope.$on(eventName, function (event, data) {
        //只初始化一次
        if (!configData.id) {
            _.extend(configData, data);
            $scope.condition = configData.condition || {};
            $scope.addedConds = _.keys($scope.condition);
            if (!configData.sort || !configData.sort.field) {
                configData.sort = {field: '@timestamp', type: 'desc'};
            }
            $scope.sort = configData.sort;
        }
        loadCfgDef.resolve();
    });
    $scope.$emit('ConsumeAConfig', {tabId: TabId, eventName: eventName});

    var IsShownTab = $('#' + TabId).hasClass('active'); //是否是当前正在显示的标签页
    $scope.$on(EVENT.TAB_SHOWN.broadcast, function (event, data) {
        if (data.target.target.indexOf('#') !== 0) {
            return;
        }
        if (data.target.target === '#' + TabId) {
            IsShownTab = true;
            $location.search('tabId', TabId);
            $scope.search();
        } else {
            IsShownTab = false;
        }
    });

    //加载字段
    $.when($myhttp.get('/logqry/fields', function (data) {
        //fieldData = data.data;
        $scope.fieldSet = data.allFields;

        allFields = data.allFields;

        $scope.addCondition();

        configData.allFields = $scope.fieldSet;

        def_show_field = _.filter(data.showFields, function (f) {
            return f !== 'message';
        }); //查询出显示的字段
        $scope.maxLengthField = _.max($scope.fieldSet, function (f) {
                return f.length;
            }) + 'NN'; //加NN是要为了防止字数相同存在大小写宽度不同
    }));
    //添加一个条件，已经使用的条件不可再次添加
    $scope.addCondition = function () {
        var reminder_conds = $scope.getReminderFields();
        if (!$scope.hasCond) {
            return;
        }
        //此条件可选择的字段
        $scope.addedConds.push(reminder_conds[0]);
    };
    $scope.removeCond = function (index) {
        var cond = $scope.addedConds.splice(index, 1);

        $scope.condition[cond[0]] && $scope.search(null, null, true);
        delete $scope.condition[cond[0]];
    };

    //获取还剩余的条件
    $scope.getReminderFields = function (field) {
        var fields = [];
        if (field) {
            fields.push(field);
        }
        var reminder_conds = _.difference($scope.fieldSet, $scope.addedConds);
        $scope.hasCond = !!reminder_conds.length;
        return fields.concat(reminder_conds);
    };

    function saveConfigData(data) {
        if (data) {
            _.extend(configData, data);
        }
        if (configData.id) {
            $scope.$emit('ToSaveConfig', configData);
        }
    }

    /**
     * 查询数据
     * @param append 是否进行追加
     */
    $scope.search = function (append, size, mask) {
        if (!IsShownTab) {
            return;
        }
        append = append === undefined ? false : append;
        //构造高亮显示字段 配置
        var fields = {};
        _.each($scope.addedConds, function (f) {
            fields[f] = {a: 1}; //如果不包含一个属性，jQuery作为参数传递时会忽略掉，所以a是随意指定的，无特殊意义
        });
        //参数信息
        var param = {
            body: {
                highlight: {
                    require_field_match: 'true',
                    pre_tags: ['<mark>'], post_tags: ['</mark>'], fields: fields
                }
            },
            size: angular.isNumber(size) ? size : 30
        };
        var condition = configData.condition;
        if (append) { //追加就使用上次的条件信息
            param.from = $scope.hits.hits.length;
        } else {
            param.countType = _timeslot.unit;
            condition = _.pick($scope.condition, $scope.addedConds);
            ////特殊条件特殊处理
            //if (condition.level) {//level 字段存储时为大写，所以要转换为大写
            //    condition.level = condition.level.toUpperCase();
            //}
            //除了message字段外都添加 * 通配符
            _.each($scope.fieldSet, function (f) {
                if (f !== 'message' && condition[f]) {
                    condition[f] = condition[f].toLowerCase(); //都转换成小写
                }
            });
            //保存配置信息
            saveConfigData({condition: condition, sort: $scope.sort});
        }

        param.condition = condition;
        _.extend(param, APP.getCurrentTimeRange(_timeslot));

        //排序,raw 排序分析字段https://github.com/elastic/elasticsearch/issues/15267
        param.sort = $scope.sort.field + ($scope.sort.field !== '@timestamp' ? '.raw' : '') + ':' + $scope.sort.type;

        $scope.searching = mask || !append || !!size || !$scope.hits.hits;
        $scope.hasMoreHits = true;
        if (!append) {
            $scope.hits = []; //条件改变之后清空当前数据
        }
        $myhttp('searching', $scope).get('/logQry/qry', param, function (data) {
            //先处理一遍message，进行html编码，否则有可能会出现<sysdate 这种误当成html标签的情况
            if (data.hits) {
                _.each(data.hits, function (hit) {
                    hit._source.message = hit._source.message.replace(/<(\w+)/g, "< $1").replace(/(\w+)>/g, "$1 >");
                });
            }
            if (append) {
                $scope.hits.total = data.total;
                $scope.hits.hits = $scope.hits.hits.concat(_.replaceHighlightField(data.hits));
            } else {
                $scope.hits = data;
                $scope.hits.hits = _.replaceHighlightField(data.hits);
            }
            if (!$scope.hits || data.total <= $scope.hits.hits.length) {
                $scope.hasMoreHits = false;
            }
        });
    };

    $scope.changeSort = function (field) {
        if (field === 'message') {//!_.contains(allFields, field)
            return;
        }
        //同一字段改变顺序，否则倒序排列
        if ($scope.sort.field === field) {
            $scope.sort.type = $scope.sort.type === 'desc' ? 'asc' : 'desc';
        } else {
            $scope.sort.field = field;
            $scope.sort.type = 'desc';
        }
        $scope.search(false, _.get($scope, 'hits.hits.length', 30));
    };
    $scope.getSortClass = function (field) {
        if (field !== 'message') { //_.contains(allFields, field) es是在内存中排序的，message字段不支持排序，太耗内存
            return $scope.sort.field === field ? ('sorting_' + $scope.sort.type) : 'sorting';
        }
        return '';
    };

    $scope.reset = function () {
        reset();
        $scope.addCondition();
    };
    //延时查询，用于监听 输入条件的改变
    var delaySearchQueue = [];
    $scope.delaySearch = function () {
        if (!$scope.conditonChangeToSearch) {
            return;
        }
        //先清空队列
        for (var i = 0; i < delaySearchQueue.length; i++) {
            $timeout.cancel(delaySearchQueue.shift());
        }
        delaySearchQueue.push($timeout(function () {
            $scope.search(null, null, true);
        }, 700));
    };


    $scope.getShowFields = function () {
        if (!configData.showFields.length) {
            configData.showFields = [].concat(def_show_field);
        }
        return configData.showFields;
    };
    $scope.getHidenFields = function () {
        return _.difference(allFields, configData.showFields);
    };
    $scope.addShowField = function (field) {
        configData.showFields.push(field);
        saveConfigData();
    };
    $scope.removeShowField = function (field) {
        var index = _.indexOf(configData.showFields, field);
        if (index !== -1) {
            configData.showFields.splice(index, 1);
            saveConfigData();
        }
    };

    //以文本方式查看
    $scope.showAsFileText = function () {
        $scope.$emit('showAsFileText', $scope.hits);
    };

    function removeMark(str) {
        if (str) {
            return str.replace(/<\/?mark>/g, '');
        }
        return str;
    }

    //在文件中查看
    $scope.showInFileUrl = function (rcd) {
        var param = {};
        param.hostName = removeMark(rcd._source.hostName);
        param.filePath = removeMark(rcd._source.filePath);
        param.envInfo = removeMark(rcd._source.envInfo);
        param.appName = removeMark(rcd._source.appName);
        param.id = removeMark(rcd._id);
        var date = dateUtil.parse(rcd._source['@timestamp']) || new Date();
        var timestamp = date.getTime();
        param.startTime = timestamp - 5000;
        param.endTime = timestamp + 5000;
        var url = '/fileview?' + $.param(param);
        return url;

    };
    //显示详细信息 状态保存
    $scope.showRecordDetail = {};
    var _timeslot = null;


    //-------------------------------------------------------------------------------公用信息
    $scope.getFieldData = function (field, rcd) {
        return field === '_source' ? getSourceData(rcd) : rcd._source[field];
    };

    function getSourceData(rcd) {
        var result = [];
        _.each(rcd, function (val, key) {
            result.push('<span class="field-key">' + key + ':</span>' + JSON.stringify(val).replace(/\\"/g, ''));
        });
        return result.join(' ');
    }

    //过滤掉不需要显示的信息
    $scope.getShowData = function (rcd) {
        return _.omit(rcd, 'showjson', '$$hashKey')
    };
    $scope.aceJson = function (obj) {
        return JSON.stringify(obj, function (key, value) {
            return value;
        }, '\t').replace(/<(\/)?mark>/g, '');
    };
    //----------------------------------------------------------------------------------
    $scope.$on(EVENT.CONDITION_CHANGE.broadcast, function (event, data) {
        if (timeRangeDef.state() !== 'pending') {
            $scope.search();
        }
    });
    $scope.$on(TabId, function (event, data) {
        _timeslot = data;
        _timeslot.value = _timeslot.timeSlot;
        timeRangeDef.resolve();
    });
    //绑定滚动加载
    $scope.$on(EVENT.SCROLL_BOTTOM.broadcast, function (event, data) {
        $scope.search(true);
    });
    //初始化,指定事件名
    $scope.$emit(EVENT.CHANGE_CONDITION.emit, TabId);
    $.when(loadCfgDef, timeRangeDef).then($scope.search);
});
require('app').register.controller('logqryController', function ($rootScope, $scope, $myhttp, $location) {

    var params = $location.search() || {};
    $scope.tabPage = '/public/views/logqry_sub.html';
    $scope.tabConfig = {
        //addTab:function(tab){}, 指令执行完之后会生成此方法 tab = {id:,name:}
        newTabName: '新建查询',
        tabs: [],//已保存的查询
        templateUrl: $scope.tabPage,
        saveCallback: saveCallback,
        addCallback: addCallback,
        closeCallback: closeCallback,
        delCallback: delCallback
    };
    //标签页信息 保存
    var configData = {
        id: '', //配置 信息标识
        name: '',
        condition: {}, //已选条件
        showFields: [] //选择显示的字段
    }; //配置信息
    var UnbindTabIds = []; //保存所有未与页面绑定的标签

    $scope.$on('ToSaveConfig', function (event, data) {
        saveConfig(data);
    });


    //配置信息同步
    function saveConfig(data) {
        var old = _.find($scope.tabConfig.tabs, function (t) {
            return t.id === data.id;
        });
        if (!old) {
            return;
        }
        _.extend(old, data);
        //去掉angular的信息
        _.each(old, function (val, key) {
            if (_.startsWith(key, '$$')) {
                delete old[key];
            }
        });

        $myhttp.post('/logqry/savecfg', JSON.stringify(old), function (data) {
            console.info(data);
        });
    }

    //查询已保存的数据
    function loadConfig() {
        $myhttp.get('/logQry/loadQry', function (data) {
            $scope.tabConfig.tabs = [];
            _.each(data, function (cfg) {
                $scope.tabConfig.addTab(cfg, cfg.id !== params.tabId);
            });
        });
    }

    function saveCallback(tab) {
        saveConfig(tab);
    }

    function addCallback(tab) {
        UnbindTabIds.push(tab.id);
        saveConfig(tab);
    }

    function closeCallback(tab) {
        _.remove($scope.tabConfig.tabs, function (t) {
            return t.id === tab.id;
        });
    }

    function delCallback(tab) {
        $myhttp.post('/logQry/delQry', JSON.stringify({id: tab.id}), function (data) {
            console.log('删除查询', tab, data);
        });
    }

    //消费一个标签
    $scope.$on('ConsumeAConfig', function (event, data) {
        var tabid = data.tabId, cfg = null;
        //通过消费者
        if (tabid && _.remove(UnbindTabIds, function (id) {
                return id === tabid;
            }).length) {
            //获取配置信息
            cfg = _.find($scope.tabConfig.tabs, function (t) {
                return t.id === tabid;
            });
            cfg = cfg ? _.omit(cfg, 'name', 'oldName') : null;
        }
        $scope.$broadcast(data.eventName, cfg);
    });
    /**
     * 显示全屏对话框
     */
    $scope.fullScreen = function (data) {
        $scope.hits = data;
        var $fullDlg = $('#fullScreenDlg');
        $fullDlg.show();
    };

    $scope.hideRecordContext = function () {
        var $fullDlg = $('#fullScreenDlg');
        $fullDlg.hide();
    };

    //var a = {
    //    index: "logstash-2015-11-30",
    //    "@timestamp": "2015-11-30 13:48:43,000",
    //    "level": "INFO",
    //    "type": "file",
    //    "filePath": "/opt/logs/rms/rules/engine.log",
    //    "envInfo": "func67",
    //    "appName": "rms-rules",
    //    "hostName": "dev21619"
    //};

    $scope.$on('showAsFileText', function (event, hits) {
        $scope.fullScreen(hits);
    });

    //开始初始化
    loadConfig();
});
