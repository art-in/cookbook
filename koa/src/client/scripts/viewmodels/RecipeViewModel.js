/**
 * The view model for Recipe.
 * @constructor
 */
define(['ko', 'lib/helpers'],
    function(ko, helpers) {

        function RecipeViewModel() {
            this.id = ko.observable(helpers.uid());
            this.name = ko.observable('');
            this.description = ko.observable('');
            this.photoId = ko.observable('');
            this.popularity = ko.observable(0);
            this.complexity = ko.observable(0);
            this.ingredients = ko.observableArray([]);
            this.steps = ko.observableArray([]);

            this.photoPath = ko.computed(function() {
                return this.photoId() ? 'images/recipes/' + this.photoId() : '';
            }.bind(this))
        }

        return RecipeViewModel;
    });
