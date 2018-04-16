/**
 * Created by weichunhe on 2015/10/27.
 */
define('util', ['base'], function () {
    return function (t) {
        /**
         * 构造 es 查询的q 参数
         * 符合lucene 查询语法
         * http://lucene.apache.org/core/2_9_4/queryparsersyntax.html
         * @param obj
         * @param op 逻辑运算符 ' AND ' 或者 ' OR '
         */
        t.makeEsQ = function (obj, op) {
            op = op || ' AND ';
            var q = [];
            _.each(obj, function (val, key) {
                val && q.push(key + ':' + val + '*');
            });
            return q.join(op);
        };
        /**
         * 生成唯一id
         * @param prefix 前缀
         * @returns {string}
         */
        t.makeUniqueId = function (prefix) {
            return prefix + '_' + _.now() + '_' + _.uniqueId();
        };

        /**
         * 计算时间
         * @param timeSlot object {value: '30', display: '30分钟', unit: 'MIN'}
         * @param startTime 如果为空就是计算endTime，否则就是计算startTime
         */
        t.calcTime = function (timeSlot, startTime) {
            var endTime = new Date(), calc = -1;
            if (startTime) {
                endTime = startTime;
                calc = 1;
            }
            switch (timeSlot.unit) {
                case 'MIN':
                    return dateUtil.addInteger(endTime, dateUtil.calendar.minute, ((timeSlot.timeSlot || timeSlot.value) - 0) * calc);
                case 'HOUR':
                    return dateUtil.addInteger(endTime, dateUtil.calendar.hour, ((timeSlot.timeSlot || timeSlot.value) - 0) * calc);
                case 'DAY':
                    return dateUtil.addInteger(endTime, dateUtil.calendar.day, ((timeSlot.timeSlot || timeSlot.value) - 0) * calc);
            }
        };

        //进入全屏
        t.requestFullScreen = function (ele, exitCb) {
            function cb() {
                exitCb && exitCb();
                document.removeEventListener('fullscreenchange', cb);
                document.removeEventListener('webkitfullscreenchange', cb);
                document.removeEventListener('mozfullscreenchange', cb);
                document.removeEventListener('msfullscreenchange', cb);
            }


            //var de = document.documentElement;
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            } else if (ele.mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            } else if (ele.webkitRequestFullScreen) {
                ele.webkitRequestFullScreen();
            }
            setTimeout(function () {
                document.addEventListener('fullscreenchange', cb);
                document.addEventListener('webkitfullscreenchange', cb);
                document.addEventListener('mozfullscreenchange', cb);
                document.addEventListener('msfullscreenchange', cb);
            }, 300);

        };
        //退出全屏
        t.exitFullscreen = function () {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        };

        //如果有高亮字段就替换到对应的字段上去
        t.replaceHighlightField = function (data) {
            var hits = data;
            if (!hits) {
                return;
            }
            _.each(hits, function (h) {
                if (h.highlight) {
                    _.each(h.highlight, function (val, key) {
                        if (h[key]) {
                            h[key] = addMark(h[key], val);
                        } else if (h._source[key]) {
                            h._source[key] = addMark(h._source[key], val);
                        }
                    });
                    delete  h.highlight;
                }
            });
            return data;
        };

        /**
         * 给src添加mark标签
         * @param src 源字符串
         * @param mark ['',''] 包含mark标签的字符串数组
         */
        function mark_reg() {
            return /<mark>(.+?)<\/mark>/g;
            //return /<mark>([\u4E00-\u9FA5\uF900-\uFA2D\w]+)<\/mark>/g;
        }

        function addMark(src, mark) {
            //取出所有符合被mark标记的字符串
            var exps = [];
            _.each(mark, function (m) {
                var matchs = m.match(mark_reg());
                _.each(matchs, function (match) {
                    //console.log(match,mark_reg.exec(match))
                    exps.push(mark_reg().exec(match)[1]);
                });
            });
            //按照长度排序,先替换长的再替换短的
            exps = _.sortBy(exps, function (e) {
                return 0 - e.length
            });
            //从长到短依次替换 源字符串
            _.each(exps, function (e) {
                src = src.replace(new RegExp('([^>]|)' + e, 'g'), function (match, $1, index, str) {
                        if (indexIsInMark(index, str)) {
                            return $1 + e;
                        }
                        return $1 + '<mark>' + e + '</mark>'
                    }
                );
            });
            return src;
        }

        function indexIsInMark(index, str) {
            if (index < 0 || str.length - index < 5) {
                return false;
            }
            var after = str.substring(index, index + 6);
            var gtIndex = after.indexOf('>');
            if (gtIndex < 0) { //向后查找5个 如果不包含>一定不是在mark中
                return false;
            } else {
                if (index + gtIndex < 5) {
                    return false;
                }
                var mark = str.substring(index + gtIndex - 5, index + gtIndex);
                if (mark.replace(/\W/g, '') === 'mark') {
                    return true;
                }
            }
            var before = str.substring(Math.min(index - 5, 0), index);
            var ltIndex = before.indexOf('<');
            if (ltIndex < 0) {
                return false;
            } else {
                var mark = str.substring(ltIndex, ltIndex + 6);
                if (mark.replace(/\W/g, '') === 'mark') {
                    return true;
                }
            }
            return false;
        }

    };
});