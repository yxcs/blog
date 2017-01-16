angular.module('koala.list', [])
		.controller('listCtrl', ['$scope', '$http', 'expressData', function($scope, $http, expressData) {
            $http({
				url:'http://localhost:3000/lists',
				method:'GET'
			}).then(function(data,header,config,status){
				$scope.data = data.data
			}, function(data,header,config,status){
				console.log(data)
			})
			
			/*var data = expressData.getData()
			$scope.data = data*/

        }])