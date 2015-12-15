define(function() {
    return function($scope, $rootScope, $location) {
        
        $rootScope.$on('recipeClosing', function() {
            $location.path('/').search('rid', null).search('new', null);
            refreshView();
        });
        $rootScope.$on('recipeOpening', function(e, recipeId) {
            $location.path('recipe').search('rid', recipeId);
            refreshView();
        });
        $rootScope.$on('recipeAdding', function() {
            $location.path('recipe').search('new', 1);
            refreshView();
        });
        $rootScope.$on('recipeAdded', function() {
            $location.path('/').search('rid', null).search('new', null);
            refreshView();
        });
        $rootScope.$on('recipeDeleted', function() {
            $location.path('/').search('rid', null);
            refreshView();
        });
        
        function refreshView() {
            var path = $location.path();
            
            if (path === '/') {
                $scope.cardShown = false;
                return;
            }
            
            if (path.search(/\/recipe/) !== -1) {
                $scope.cardShown = true;
                return;
            }
        }
        
        refreshView();
    };
});