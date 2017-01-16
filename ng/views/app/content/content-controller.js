angular.module('koala.content', [])
		.controller('contentCtrl', function($scope, $http, $stateParams, expressData) {
			
			var id = $stateParams.id
			$http({
				url:'http://localhost:3000/users/articles/' + id,
				method:'GET'
			}).then(function(data,header,config,status){
				$scope.data = data.data[0]
			}, function(data,header,config,status){
				console.log(data)
			})

			/*var data = expressData.getData()
			$scope.data = data*/
        })