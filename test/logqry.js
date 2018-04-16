/**
 * Created by weichunhe on 2015/11/11.
 */

define(['app', 'logqry'], function () {

    describe('load all show fields', function () {
        var $myhttp = null, $rootScope = null, $controller, $location;

        //$injector = angular.injector(['app']);
        require('app').register.controller('testCtrl', function (name) {
            console.log('controller', name);
        });
        my$injector.invoke(function (_$controller_, _$rootScope_, _$myhttp_, _$location_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $myhttp = _$myhttp_;
            $location = _$location_;
        });

        it('tabPage should has', function () {
            //var $scope = $rootScope.$new();
            //$controller('logqryController', {$scope: $scope, $myhttp: $myhttp, $location: $location});
            //expect($scope.tabPage).toBe('/public/views/logqry_sub.html');
        });

        it('should return [appName,hostName,message,level]', function (done) {
            $myhttp.get('/logqry/fields', function (data) {
                expect(_.keys(data).length).toBe(2);
                done();
            });
        });

        it('should get context be null', function (done) {
            $myhttp.get('/logqry/recordContext', {}, function (data) {
                expect(data.total).toBe(0);
                expect(data.message).toBe('条件不完整!');
                done();
            });
        });
        it('should get context', function (done) {
            var a = {
                index: "logstash-2015.11.30",
                "@timestamp": "2015-11-30 13:48:43,000",
                "level": "INFO",
                "type": "file",
                "filePath": "/opt/logs/rms/rules/engine.log",
                "envInfo": "func67",
                "appName": "rms-rules",
                "hostName": "dev21619"
            };
            $myhttp.get('/logqry/recordContext', a, function (data) {
                expect(data.total > 0).toBeTruthy();
                done();
            });
        });
    });
});

