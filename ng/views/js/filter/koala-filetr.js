angular.module('koala.filter', [])
    .filter('addtext', function() {
        return function(value) {
            return value[value.length - 1] + 'filter'
        }
    })