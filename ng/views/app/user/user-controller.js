angular.module('koala.user', [])
		.controller('userCtrl', ['$scope', '$http', 'expressData', '$stateParams', function($scope, $http, expressData, $stateParams) {
            $http({
				url:'http://localhost:3000/users/data/' + $stateParams.id,
				method:'GET'
			}).then(function(data,header,config,status){
				$scope.data = data.data
			}, function(data,header,config,status){
				console.log(data)
			})
			
			/*var data = expressData.getData()
			$scope.data = data*/

        }])