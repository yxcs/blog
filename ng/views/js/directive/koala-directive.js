angular.module('koala.directive', [])
	.directive('myBaidu', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                myUrl: '@myUrl',
                ngModel: '='
            },
            template: '<a href="{{myUrl}}">{{ngModel}}</a>',
            controller: function($scope) {
                $scope.ngModel = 'dddddd'
            },
            link: function(scope) {
                scope.data = 'baidu'
            }
        }
    })