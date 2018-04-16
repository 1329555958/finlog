/**
 * Created by baodekang on 2015/11/3.
 */
var WarnRuleEnum = [
    {frequency: 1, unit: 'min', cron: '00 */1 * * * *'},
    {frequency: 5, unit: 'min', cron: '00 */5 * * * *'},
    {frequency: 10, unit: 'min', cron: '00 */10 * * * *'},
    {frequency: 15, unit: 'min', cron: '00 */15 * * * *'},
    {frequency: 30, unit: 'min', cron: '00 */30 * * * *'},
    {frequency: 1, unit: 'hour', cron: '00 00 */1 * * *'},
    {frequency: 6, unit: 'hour', cron: '00 00 */6 * * *'},
    {frequency: 12, unit: 'hour', cron: '00 00 */12 * * *'},
    {frequency: 1, unit: 'day', cron: '00 00 00 */1 * *'}
];

module.exports = WarnRuleEnum;