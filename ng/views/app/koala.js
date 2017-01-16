angular.module('koala', ['ui.router', 
                         'koala.router', 
                         'koala.content', 
                         'koala.list',
                         'koala.user',
                         'koala.directive', 
                         'koala.factory',
                         'koala.filter'])
    .constant('API', 'http://localhsot:3344/')
    .run(function($rootScope) {
    	$rootScope.name = 'keqi'
    })