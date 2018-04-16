/**
 * Created by weichunhe on 2015/11/26.
 */
var tools = require('./tools');
var path = require('path');
var _ = require("lodash");
var constant = require('./EsConstant');
//自定义查询标签页
var CUSTOM_LOG_QRYS = [];
/**
 * 缓存自定义日志查询
 * getter/setter
 * @param data
 */
var customLogQrysPath = path.join(__dirname, 'CacheCustomQrys.txt');
/**
 * 删除指定用户的数据
 * @param userId 如果为空，全部删除
 */
function deleteQrysByUser(userId) {
    if (!userId) {
        CUSTOM_LOG_QRYS = [];
    } else {
        _.remove(CUSTOM_LOG_QRYS, function (qry) {
            return qry[constant.USER.DOC_KEY] == userId;
        });
    }
}

/**
 * getter/setter方法
 * @param data 需要保存的数据
 * @param userId 用户id
 */
exports.customLogQrys = function (data, userId) {
    if (data !== undefined) {
        deleteQrysByUser(userId);
        CUSTOM_LOG_QRYS = CUSTOM_LOG_QRYS.concat(data);
    } else {
        if (userId) {
            return _.filter(CUSTOM_LOG_QRYS, function (qry) {
                return qry[constant.USER.DOC_KEY] == userId;
            });
        }
        return CUSTOM_LOG_QRYS;
    }
    //if (data) {
    //    tools.writeJson(customLogQrysPath, data);
    //} else {
    //    return tools.readJSON(customLogQrysPath);
    //}
};
