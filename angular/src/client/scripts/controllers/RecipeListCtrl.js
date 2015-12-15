define(['co'],
    function(co) {
        return function ($scope, $rootScope, $location, $sce, Recipes) { 
            
            $scope.recipes = [];
            $scope.sortProp = '';
            $scope.sortDirection = 1; // 1 / -1
            $scope.pageSize = 4;
            $scope.pageNumber = 1; // 1, 2, 3, ...
            $scope.pages = [];
            
            $rootScope.$on('recipeAdded', reloadRecipes);
            $rootScope.$on('recipeUpdated', reloadRecipes);
            $rootScope.$on('recipeDeleted', reloadRecipes);
            $rootScope.$on('recipesSorting', function(e, data) {
                $location.search('sd', data.sortDirection)
                         .search('sp', data.sortProp);
                reloadRecipes();
            });
            $rootScope.$on('recipesPaging', function(e, pageNumber) {
                $location.search('p', pageNumber);
                reloadRecipes();
            });
            
            function reloadRecipes() { return co(function* () {
                 var query = $location.search();
                
                $scope.sortProp = query.sp || 'name';
                $scope.sortDirection = query.sd || 1;
                $scope.pageNumber = parseInt(query.p, 10) || 1;
                
                // Selected page less then zero is not allowed
                if ($scope.pageNumber <= 0) {
                    $location.search('p', 1);
                    reloadRecipes();
                    return;
                }
                
                // Load recipes
                var data = yield Recipes.getRecipes({
                    sortProp: $scope.sortProp,
                    sortDirection: $scope.sortDirection,
                    skip: ($scope.pageNumber) 
                            ? ($scope.pageNumber - 1) * $scope.pageSize
                            : 0,
                    limit: $scope.pageSize
                });
                
                // Anti-XSS
                data.recipes.map(function (recipe) {
                    return recipe.description = $sce.trustAsHtml(recipe.description);
                });
                
                $scope.recipes = data.recipes;
                
                // Calc paging
                var total = data.total;
                var pageCount = Math.ceil(total / $scope.pageSize);
            
                var pages = [];
                for (var i = 0; i < pageCount; i++) {
                    pages.push(i + 1);
                }
                
                $scope.pages = pages;
                
                // If selected page does not exist - go to the last one
                if ($scope.pageNumber > pages.length) {
                    $location.search('p', pages[pages.length-1]);
                    reloadRecipes();
                    return;
                }
                
                // Antipattern. Applying scope after async action.
                !$scope.$$phase && $scope.$apply();
            })}
            
            this.onRecipeSelect = function(recipe) {
                $rootScope.$broadcast('recipeOpening', recipe.id);
            };
            
            this.onRecipeAdd = function() {
                $rootScope.$broadcast('recipeAdding');
            };
            
            this.onRecipeDelete = co.wrap(function* (recipe, e) {
                e.stopPropagation();
                yield Recipes.deleteRecipe(recipe.id);
                reloadRecipes();
            });
            
            this.onSort = function(prop, e) {
                var query = $location.search();
                
                var sortDirection = query.sp === prop
                                    ? parseInt(query.sd, 10) * (-1)
                                    : 1;
                                    
                $rootScope.$broadcast('recipesSorting', { 
                    sortProp: prop,
                    sortDirection: sortDirection
                });
            };
            
            this.onPaging = function(pageNumber) {
                if ($scope.pageNumber === pageNumber) return;
                $rootScope.$broadcast('recipesPaging', pageNumber);
            };
            
            this.onPrevPage = function() {
                var currentPageNumber = $scope.pageNumber;
                if (currentPageNumber === 1) return;
                $rootScope.$broadcast('recipesPaging', currentPageNumber - 1);
            };
        
            this.onNextPage = function() {
                var currentPageNumber = $scope.pageNumber;
                if ($scope.pages.indexOf(currentPageNumber + 1) === -1) return;
                $rootScope.$broadcast('recipesPaging', currentPageNumber + 1);
            };
            
            reloadRecipes();
        };
    });