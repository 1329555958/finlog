/**
 * Created by weichunhe on 2015/10/21.
 */
console.log('demo loaded!!!!');
require('app').register.controller('demoController', function ($scope,$timeout) {
    $scope.name = 'wch';
    $scope.arr = ['_jse', 'aaa'];
    $scope.aaaa = '2015-12-01 10:10:10';
    $timeout(function(){
        $scope.aaaa = '2015-11-11 10:10:10';
    },3000);
    $('#datetimepicker12').datetimepicker({
        inline: true,
        format:'YYYY-MM-DD'
    });
});