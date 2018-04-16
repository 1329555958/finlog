/**
 * Created by weichunhe on 2015/10/22.
 * 日志查询
 */
require('app').register.controller('TraceController', function ($scope, $myhttp, $timeout, $location, $rootScope) {
    /*
     @timestamp
     :
     "2016-11-14T01:38:51.098Z"
     appName
     :
     "vfinance"
     chainId
     :
     "CID8095f52314a74d4786fa98f52d8bbb52"
     className
     :
     "org.wch.logagent.controller.HomeController"
     cost
     :
     "2717"
     envInfo
     :
     "func"
     extId
     :
     "null"
     filePath
     :
     "/tomcat/vfinance/logs/temp"
     id
     :
     "1"
     message
     :
     ""
     methodName
     :
     "header"
     params
     :
     "org.apache.catalina.connector.RequestFacade@6dcab0ed,null"
     result
     :
     "hello"
     topic
     :
     "trace"
     traceId
     :
     "TID132964f7dbf84284bba03775275a7fa2"
     */
    $scope.span = {};

    /**
     * 参数的get/set方法
     * @param name
     * @param val
     * @returns {*}
     */
    function searchParam(name, val) {
        if (val == undefined) {
            return $location.search()[name];
        } else {
            $location.search(name, val);
        }
    }

    $scope.chainId = searchParam("chainId");

    $scope.search = function () {
        if (!$scope.chainId) {
            alert("请输入追踪链编号!");
            return;
        }
        var param = {chain: $scope.chainId};
        searchParam("chainId", $scope.chainId);
        $scope.searching = true;
        $myhttp('searching', $scope).get('/trace/qry', param, function (data) {
            $scope.hits = data;
            initTree(makeTree(data.hits));
        });
    };


    function getSpans(hits) {
        var spans = _.map(hits, function (hit) {
            return hit._source;
        });
        return spans;
    }

    /**
     * 从spans中获取parent的子节点
     * @param parent
     * @param spans
     * @return []
     */
    function addChildren(parents, spans) {
        if (spans.length === 0) {
            return;
        }
        _.each(parents, function (parent) {
            var children = _.remove(spans, function (child) {
                return child.traceId === parent.traceId && isChildId(child.id, parent.id);
            });
            if (children.length) {
                parent.nodes = children;
                addChildren(children, spans); //递归
            }
        });
    };
    /**
     * 判断cid是pid的直接下级，即只多一级id
     * @param cid 下级id
     * @param pid 父id
     */
    function isChildId(cid, pid) {
        return cid.substring(0, cid.lastIndexOf(".")) === pid;
    }

    /**
     * 获取根节点
     * @param spans
     * @return []
     */
    function getRootNodes(spans) {
        return _.remove(spans, function (span) {
            return span.id === "1";
        });
    }

    /**
     * 给所有节点添加名称
     * @param spans
     */
    function addNodeText(spans) {
        _.each(spans, function (span) {
            span.text = makeNodeText(span);
        });
    }

    /**
     * 构造说明信息
     * @param span
     */
    function makeNodeText(span) {
        var text = [];
        if (span.className) {
            //添加类信息
            text.push(span.className.substring(span.className.lastIndexOf(".") + 1));
            text.push(".");
        }
        //方法名
        text.push(span.methodName);

        //应用
        //text.push("&nbsp;&nbsp;<small class=\"label bg-yellow\">" + span.appName + "</small>");
        //text.push("&nbsp;&nbsp;<small class=\"label bg-blue\">" + span.cost + "</small>");
        //text.push("&nbsp;&nbsp;<small class=\"label bg-red\">" + span['@timestamp'] + "</small>");
        //text.push("&nbsp;&nbsp;<small class=\"label bg-maroon\">" + span.result + "</small>");
        //text.push("&nbsp;&nbsp;<small class=\"label bg-aqua\">" + span.params + "</small>");
        return text.join("");
    }

    function makeTree(data) {
        var spans = getSpans(data);
        addNodeText(spans);
        var roots = getRootNodes(spans);
        addChildren(roots, spans);
        //再把不同应用之间的root合并起来
        var tree = [];
        for (var i = 0; i < roots.length; i++) {
            var result = {success: false};
            var node = roots[i];
            //从除了它自己之外的所有根节点中找其父节点
            for (var j = 0; j < roots.length; j++) {
                if (i === j) { //如果是同一个节点就不用查找了
                    continue;
                }
                mergeTree(roots[j], node, result);
                //已经合并成功了
                if (result.success) {
                    break;
                }
            }
            //没合并成功，就是在其他根节点中没有找到其对应的父节点，那它就是根节点
            if (!result.success) {
                tree.push(node);
            }
        }
        if (!tree.length && $scope.hits.length) {
            console.error("数据异常!", $scope.hits);
        }
        return tree;
    }

    /**
     * 合并两颗树，从ptree中查找是否存在tree的父节点，如果存在就合并成功result.success = true,如果不存在就合并不成功,result.success = false;
     * @param pTree 一个节点
     * @param tree
     * @param result
     */
    function mergeTree(pTree, tree, result) {
        if (pTree == null) {
            return;
        }
        if (pTree.extId === tree.traceId) {
            _.extend(pTree, tree);
            result.success = true;
        }
        if (pTree.nodes) {
            _.each(pTree.nodes, function (node) {
                mergeTree(node, tree, result);
            });
        }
    }

    function initTree(data) {
        $('#tree').treeview({data: data});
        if (data !== null && data.length) {
            $('#tree').on('nodeSelected', onNodeSelected);
            $('#tree').treeview('selectNode', [0, {silent: true}]);
            var node = $('#tree').treeview('getNode', 0);
            onNodeSelected(null, node);
        }
    }

    function onNodeSelected(event, data) {
        $scope.span = data;
        $scope.$digest();
    }

    (function init() {
        //如果有参数，就默认查询一下
        if ($scope.chainId) {
            $scope.search();
        }
    })();

    var tree = [
        {
            text: "Parent 1",
            nodes: [
                {
                    text: "Child 1",
                    nodes: [
                        {
                            text: "Grandchild 1 <a href='#'>safdadf</a>"
                        },
                        {
                            text: "Grandchild 2"
                        }
                    ]
                },
                {
                    text: "Child 2"
                }
            ]
        },
        {
            text: "Parent 2"
        },
        {
            text: "Parent 3"
        },
        {
            text: "Parent 4"
        },
        {
            text: "Parent 5"
        }
    ];

});