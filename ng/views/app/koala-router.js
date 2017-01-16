angular.module('koala.router', [])
		.config(function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.when("/", "/index");
			$urlRouterProvider.when("", "/index");
        	$stateProvider
        	    .state('index',{
        	    	url: '/index',
        	    	templateUrl: 'app/list/list.html',
                    controller: 'listCtrl',
                    cache: false
        	    })
            	.state('content', {
                	url:'/content?id',
                    templateUrl:'app/content/content.html',
                    controller: 'contentCtrl',
                    cache: false
           	    })
                .state('user', {
                    url:'/user?id',
                    templateUrl:'app/user/user.html',
                    controller: 'userCtrl',
                    cache: false
                })
    	})