angular.module('efectototal.directives', [])

.directive('progressBar', function(){
	return {
		restrict: 'E',
		scope: {
			value: '=',
			max: '='
		},
		link: function(scope, elem, attrs){
			scope.$watch('value', function(){
				var width = parseFloat(scope.value)/parseFloat(scope.max)*95;
				elem.css('width', width+'%');
			});
		}
	}
});