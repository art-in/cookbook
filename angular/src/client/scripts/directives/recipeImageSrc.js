define(function() {
    return function() {
        return {
            link: function($scope, element, attrs) {
                $scope.$watch('recipe.photoId', function (v) {
                    var recipeId = attrs.recipeImageSrc;
                    var imageUrl = recipeId ? 'images/recipes/' + recipeId : '';
                    element[0].setAttribute('src', imageUrl);
                });
            }
        };
    };
});