angular.module('efectototal.directives', [])
.directive('external', function(){
	return {
		restrict: 'C',
		link: function(scope, elem, attrs){ 
			elem.on('click', function(e){
				e.preventDefault();
				console.log(attrs);
				window.open(attrs.href, '_system', 'location=yes');
			});
		}
	}
})
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
				width = width <= 95 ? width : 95;
				elem.css('width', width+'%');
			});
		}
	}
});