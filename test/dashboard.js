/**
 * Created by weichunhe on 2015/11/25.
 */
    //查询最近半小时,每台服务器日志数
define(['app'], function () {

    describe('查询图表数据', function () {
        var $myhttp = null, $rootScope = null, $controller;
        var my$injector = angular.injector(['app']);
        my$injector.invoke(function (_$controller_, _$rootScope_, _$myhttp_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $myhttp = _$myhttp_;
        });

        it('没有此种类型的统计结果', function (done) {
            $myhttp.get('/dashboard/countByAppName', {type: 'half_h'}, function (data) {
                expect(data.success).toEqual(false);
                done();
            });
        });
        it('查询到统计结果', function (done) {
            $myhttp.get('/dashboard/countByAppName', {type: 'halfHour'}, function (data) {
                expect(angular.isArray(data)).toEqual(true);
                expect(angular.isString(data[0].x)).toBeDefined();
                expect(angular.isNumber(data[0].y)).toBeDefined();
                done();
            });
        });

        it('自定义图表数据,结果为空', function (done) {
            $myhttp.get('/dashboard/datehistogram', {type: 'perMinInHalfHour', qryId: 'aaa'}, function (data) {
                expect(data.length).toEqual(0);
                done();
            });
        });

        it('自定义图表数据,结果不为空', function (done) {
            $myhttp.get('/dashboard/datehistogram', {
                type: 'perMinInHalfHour',
                qryId: 'tab_1448347501844_1'
            }, function (data) {
                expect(data.length).toBeDefined();
                done();
            });
        })

        it('添加自定义图表,参数不完整', function (done) {
            $myhttp.post('/dashboard/saveCustomChart', function (data) {
                expect(data.message).toEqual('参数不完整!');
                done();
            });
        })
        $myhttp.post('/dashboard/deleteCustomChart', JSON.stringify({
            id: '1111'
        }), function () {
        });
        it('添加自定义图表,保存成功', function (done) {
            $myhttp.post('/dashboard/saveCustomChart', JSON.stringify({
                id: '1111',
                qryId: '1111',
                title: '测试'
            }), function (data) {
                expect(data.success).toBeTruthy();
                done();
            });
        })
        it('查询自定义图表数据', function (done) {
            $myhttp.get('/dashboard/getCustomChart', function (data) {
                expect(data.length).toBeGreaterThan(0);
                done();
            })
        })
        it('删除自定义图表', function (done) {
            $myhttp.post('/dashboard/deleteCustomChart', JSON.stringify({
                id: '1111'
            }), function (data) {
                expect(data.success).toBeTruthy();
                done();
            });
        });
        it('测试jasmine', function () {
            expect(null).toBeNull();
            expect(null).toBeFalsy();
            expect(undefined).toBeFalsy();
            expect(false).toBeFalsy();
            expect(0).toBeFalsy();
            expect('').toBeFalsy();
            expect([]).toBeTruthy();
            expect(1).toBeTruthy();
            expect(1).not.toBe(true);
            expect(undefined).not.toBeNull();
        });
    });
});

//半小时内每分钟日志数

