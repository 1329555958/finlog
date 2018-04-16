/**
 * Created by weichunhe on 2015/10/21.
 */
require('app').register.controller('warnerrdetailController', function ($scope, $myhttp) {
    //var date = new Date();
    //$scope.startDate = dateUtil.format(date, 'yyyy-MM-dd hh:mm:ss');
    //$scope.endDate = dateUtil.format(dateUtil.addInteger(date, dateUtil.calendar.day, 7), 'yyyy-MM-dd hh:mm:ss');

    $scope.searchByCondition = function (page) {
        var condition = {
            name  : $scope.name,
            startDate: $scope.startDate,
            endDate: $scope.endDate,
            currentPage: page ? page : 1,
            pageSize   : 10
        };
        $myhttp.post('/warnErrorInfo/search',
            JSON.stringify(condition), function (response) {
                if (!response.success) {
                    alert(response.message);
                } else {
                    $scope.page = response.info;
                    $scope.warnErrorInfos = $scope.page.records;
                }
            });
    };

    $scope.queryByPage = function(page){
        $scope.searchByCondition(page);
    };
    $scope.searchByCondition();
});