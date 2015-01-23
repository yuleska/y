'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.alerts = [{
            icon: 'glyphicon-user',
            colour: 'btn-success',
            total: '20,309',
            description: 'TOTAL CUSTUMER'
        }, {
            icon: 'glyphicon-calendar',
            colour: 'btn-primary',
            total: '20,309',
            description: 'TOTAL CALENDAR'
        }, {
            icon: 'glyphicon-record',
            colour: 'btn-info',
            total: '309',
            description: 'TOTAL RECORD'
        }, {
            icon: 'glyphicon-flag',
            colour: 'btn-warning',
            total: '20,309',
            description: 'TOTAL FLAG'
        }];
    }
]);
