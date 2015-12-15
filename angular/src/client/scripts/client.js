/**
 * Main client-side module.
 * 
 * Another idea for project structure is to have sertain component stuff
 * together in one folder ('by components'),
 * instead of .controllers/directives/etc ('by function'):
 * 
 * - componentA/
 * -  - componentA.js
 * -  - componentA.html
 * -  - componentA.css
 * - componentB/
 * -  - componentB.js
 * -  - componentB.html
 */
define('client', 
    ['angular',
     'controllers/AppCtrl',
     'controllers/RecipeListCtrl',
     'controllers/RecipeCardCtrl',
     'directives/recipeImageSrc',
     'directives/contenteditable',
     'directives/focusSelectContent',
     'directives/setFocus',
     'directives/numberInput',
     'models/Recipe',
     'services/Recipes',
     'mappers/ModelMapper',
     'lib/helpers'], 
    function (angular, AppCtrl, RecipeListCtrl, RecipeCardCtrl,
              recipeImageSrc, contenteditable, focusSelectContent, setFocus, numberInput,
              Recipe, Recipes, ModelMapper, helpers) {
        
        // Collision of two separate module systems: requirejs and Angular modules.
        // It works but looks dirty, yes.
        // Angular does not have module loader, and I prefer
        // - to have separate files for all my controllers/directives/etc,
        // - to avoid adding script tags in correct order to the html by hand.
        // Another solution is to combine all js into bundle (no need in module loader),
        // but it requires build step to create that bundle (browserify).
        angular.module('client', [])
            .controller('AppCtrl', AppCtrl)
            .controller('RecipeListCtrl', RecipeListCtrl)
            .controller('RecipeCardCtrl', RecipeCardCtrl)
            .directive('recipeImageSrc', recipeImageSrc)
            .directive('contenteditable', contenteditable)
            .directive('focusSelectContent', focusSelectContent)
            .directive('setFocus', setFocus)
            .directive('numberInput', numberInput)
            .factory('Recipe', Recipe)
            .factory('Recipes', Recipes)
            .factory('ModelMapper', ModelMapper)
            .factory('helpers', helpers);
            
        angular.bootstrap(document, ['client']);
    });