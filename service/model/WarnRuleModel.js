/**
 * Created by baodekang on 2015/10/30.
 */
/**
 *  警告规则 model
 */
module.exports = function(){
    return {
        id: null,
        name: null,
        description: null,
        queryField: null,
        type: null,
        minutes: null,
        comSymbol: null,
        peakValue: null,
        fieldName: null,
        dimension: null,
        comSymbol: null,
        count: null,
        peakTime: null,
        email: null,
        frequency: null,
        frequencyUnit: null,
        status: true,
        warning: true,
        disabled: false,
        lastTime: null
    }
};