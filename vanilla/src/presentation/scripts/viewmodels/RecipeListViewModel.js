/**
 * Recipe list view model
 * @constructor
 */
define(['ko', 'lib/messageBus'], function(ko, messageBus) {

    function RecipeListViewModel(state) {
        this.state = state;

        this.recipes = state.recipes;

        this.isLoading = ko.observable(true);

        this.pageSize = ko.observable(4); // TODO
        this.pageNumber = ko.observable(1); // 1, 2, 3, ...
        this.pages = ko.observableArray([]);

        this.sortProp = ko.observable('name');
        this.sortDirection = ko.observable(1); // 1 - asc, -1 - desc

        messageBus.subscribe('recipesLoading', this.onRecipesLoading.bind(this));
        messageBus.subscribe('recipesLoaded', this.onRecipesLoaded.bind(this));
        messageBus.subscribe('recipeDeleting', this.onRecipeDeleting.bind(this));
    }

    RecipeListViewModel.prototype.onRecipesLoading = function() {
        this.isLoading(true);
    };

    RecipeListViewModel.prototype.onRecipesLoaded = function(data) {
        var total = data.total;
        var pageCount = Math.ceil(total / this.pageSize());

        this.pages([]);
        for (var i = 0; i < pageCount; i++) {
            this.pages.push(i + 1);
        }

        this.state.recipes(data.recipeVMs);

        this.isLoading(false);
    };

    RecipeListViewModel.prototype.onRecipeDeleting = function() {

        if (this.pageNumber() > 0 && this.recipes().length === 1) {
            this.pageNumber(this.pageNumber() - 1);
        }
    };

    RecipeListViewModel.prototype.onAdding = function() {
        messageBus.publish('recipeAddStarted');
    };

    RecipeListViewModel.prototype.onItemClick = function(recipeVM) {
        messageBus.publish('recipeSelecting', recipeVM);
    };

    RecipeListViewModel.prototype.onItemDeleting = function(recipeVM, $event) {
        messageBus.publish('recipeDeleting', recipeVM);
        $event.stopPropagation();
    };

    RecipeListViewModel.prototype.onSorting = function(sortProp) {
        this.pageNumber(1);

        var sortDirection = this.sortProp() !== sortProp ? 1 : -this.sortDirection();

        this.sortProp(sortProp);
        this.sortDirection(sortDirection);

        messageBus.publish('recipesSorting');
    };

    RecipeListViewModel.prototype.onPaging = function(pageNumber) {
        if (this.pageNumber() === pageNumber) return;

        this.pageNumber(pageNumber);
        messageBus.publish('recipesPaging');
    };

    RecipeListViewModel.prototype.onPrevPage = function() {
        var currentPageNumber = this.pageNumber();
        if (currentPageNumber === 1) return;

        this.pageNumber(currentPageNumber - 1);
        messageBus.publish('recipesPaging');
    };

    RecipeListViewModel.prototype.onNextPage = function() {
        var currentPageNumber = this.pageNumber();
        if (this.pages.indexOf(currentPageNumber + 1) === -1) return;

        this.pageNumber(currentPageNumber + 1);
        messageBus.publish('recipesPaging');
    };

    return RecipeListViewModel;
});