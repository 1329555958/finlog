/**
 *
 * 作者：weich
 * 邮箱：1329555958@qq.com
 * 日期：2017/3/15
 *
 * 未经作者本人同意，不允许将此文件用作其他用途。违者必究。
 *
 * @ngdoc
 * @author          weich
 * @name            Role
 * @description
 */
var high = 5.3;
var low = 4.58;
/**
 * 四舍五入保留小数
 * @param number 要处理的数
 * @param length 保留小数点的位数，默认两位
 */
function round(number, length = 2) {
    let scale = Math.pow(10,length);
    number *= scale;
    number = Math.round(number);
    number /= scale;
    return number;
}
console.log(round(3.4556));

console.log((high - low) * 0.382 + low);
console.log((high - low) * 0.5 + low);
console.log((high - low) * 0.618 + low);



