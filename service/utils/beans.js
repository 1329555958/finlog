/**
 * Created by weichunhe on 2015/10/26.
 */
var beans = {};

beans.newErr = function (code, msg) {
    return {code: code || 500, msg: msg};
};

module.exports = beans;