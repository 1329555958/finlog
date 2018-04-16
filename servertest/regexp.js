/**
 * Created by weichunhe on 2015/11/27.
 */

var _ = require('lodash');
function mark_reg() {
    return /<mark>(\w+)<\/mark>/g;
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
    //按照长度排序
    exps = _.sortBy(exps, function (e) {
        return e.length
    });
    //从长到短依次替换 源字符串
    _.each(exps, function (e) {
        src = src.replace(new RegExp(e, 'g'), '<mark>' + e + '</mark>');
    });
    return src;
}

var str = '1234567335671', marks = ['<mark>1</mark>2', '<mark>3</mark>4<mark>5</mark>6'];
//console.log(addMark(str,marks));
//console.log(mark_reg.exec('<mark>4</mark>'))
//console.log('33',mark_reg.exec('4</mark>'))
//console.log('312a12b1212'.replace(/([^a])12/g,'$1rr'))
//console.log('312a12b1212'.replace(/([^a])12/g,function(){
//    console.log(arguments);
//    return '$1rr';
//}))

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
var str = '<mark>111</mark>abc<mark>def</mark>ghik<mark>sgf=</mark>';
for (var i = 0; i < str.length; i++) {
    console.log(str[i], indexIsInMark(i, str));
}
