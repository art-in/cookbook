/**
 * The view-model of selected recipe.
 */
define(['ko', 
        'lib/messageBus', 
        'lib/helpers', 
        'mappers/modelMapper', 
        'mappers/viewModelMapper', 
        'viewmodels/RecipeViewModel'],
    function(ko, 
             messageBus, 
             helpers,
             modelMapper, 
             viewModelMapper, 
             RecipeViewModel) {

        function RecipeCardViewModel(state) {
            this.state = state;

            this.recipe = ko.observable(new RecipeViewModel());
            this.active = ko.observable(false);
            this.inEditMode = ko.observable(false);
            this.isNewRecipe = ko.observable(false);

            this.recipeBeforeEditing = {};

            // Save/restore properties before/after editing
            this.inEditMode.subscribe(function(inEditMode) {
                if (inEditMode) {
                    this.recipeBeforeEditing = modelMapper.mapRecipeFromVM(this.recipe());
                } else {
                    viewModelMapper.mapRecipe(this.recipeBeforeEditing, this.recipe());
                }
            }.bind(this));

            messageBus.subscribe('recipePhotoUploaded', this.onRecipePhotoUploaded.bind(this));
        }

        RecipeCardViewModel.prototype.onClosing = function () {
            this.active(false);
            this.inEditMode(false);
            this.recipe(new RecipeViewModel());
        };

        RecipeCardViewModel.prototype.onSaving = function() {
            messageBus.publish(
                this.isNewRecipe() ? 'recipeAdding' : 'recipeUpdating',
                this.recipe());

            if (this.isNewRecipe()) this.onClosing();

            this.recipeBeforeEditing = modelMapper.mapRecipeFromVM(this.recipe());
            this.inEditMode(false);
        };

        RecipeCardViewModel.prototype.onDiscarding = function() {
            this.inEditMode(false);
        };

        RecipeCardViewModel.prototype.onEditing = function() {
            this.inEditMode(true);
        };

        RecipeCardViewModel.prototype.onDeleting = function () {
            messageBus.publish('recipeDeleting', this.recipe());
            this.onClosing();
        };

        RecipeCardViewModel.prototype.onAddingIngredient = function () {
            var ingredient = { name: ko.observable('Новый ингредиент') };
            this.recipe().ingredients.push(ingredient);
        };

        RecipeCardViewModel.prototype.onDeletingIngredient = function (ingredient) {
            this.recipe().ingredients.remove(ingredient);
        };

        RecipeCardViewModel.prototype.onAddingStep = function () {
            var step = { name: ko.observable('Новый шаг') };
            this.recipe().steps.push(step);
        };

        RecipeCardViewModel.prototype.onDraggingStep = function(stepNode) {
            var stepVM = ko.dataFor(stepNode);
            
            var stepVMs = this.recipe().steps();
            
            var prevIndex = stepVMs.indexOf(stepVM);
            var newIndex = helpers.getChildNodeIndex(stepNode.parentElement, stepNode, 'step-list-item');
            
            // FIXME: dirty hack
            // After we messed up with DOM manually
            // by dragging element to another position,
            // knockout (the Chief of the DOM) got confused,
            // and loses reference to this element. So even
            // if we would re-assign tasks to another array (or .removeAll()),
            // the dragged element will stay in the DOM anyway.
            // Let's clean container directly for now.
            this.recipe().steps([]);
            $('.step-list').empty();
            
            helpers.arrayMoveItem.call(stepVMs, prevIndex, newIndex);
            
            this.recipe().steps(stepVMs);
        };
        
        RecipeCardViewModel.prototype.onDeletingStep = function (step) {
            this.recipe().steps.remove(step);
        };

        RecipeCardViewModel.prototype.onPhotoUploading = function (file) {
            if (!file) return; // File dialog was canceled.

            messageBus.publish('recipePhotoUploading', this.recipe(), file);
        };

        RecipeCardViewModel.prototype.onRecipePhotoUploaded = function(recipeId) {
            if (recipeId = this.recipe().id()) {
                this.recipe().photoId(recipeId);
            }
        };

        RecipeCardViewModel.prototype.onRecipePhotoDeleting = function(vm, $event) {
            this.recipe().photoId('');
            $event.stopPropagation();
        };

        return RecipeCardViewModel;
    });