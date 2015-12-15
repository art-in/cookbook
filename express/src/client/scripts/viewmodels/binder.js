/**
 * Binds view-models with view unobstusively.
 */
define(['jquery', 'unobtrusive-knockout', 'lib/knockout-bindings'], function($) {

    function setupBindings() {

        // Recipe List

        $('.recipes .add').dataBind({ click: '$root.views.recipeList.onAdding.bind($root.views.recipeList)' });

        $('.recipes .sorting .alphabet').dataBind({ click: '$root.views.recipeList.onSorting.bind($root.views.recipeList, "name")',
                                                   css: { "'active'": '$root.views.recipeList.sortProp() === "name"' }});
        $('.recipes .sorting .complexity').dataBind({ click: '$root.views.recipeList.onSorting.bind($root.views.recipeList, "complexity")',
                                                     css: { "'active'": '$root.views.recipeList.sortProp() === "complexity"' }});
        $('.recipes .sorting .popularity').dataBind({ click: '$root.views.recipeList.onSorting.bind($root.views.recipeList, "popularity")',
                                                     css: { "'active'": '$root.views.recipeList.sortProp() === "popularity"' }});

        $('.recipes .paging .prev').dataBind({ click: '$root.views.recipeList.onPrevPage.bind($root.views.recipeList)' });
        $('.recipes .paging .next').dataBind({ click: '$root.views.recipeList.onNextPage.bind($root.views.recipeList)' });
        $('.recipes .paging .page-list').dataBind({ foreach: "{ data: $root.views.recipeList.pages, as: 'pageNumber' }" });
        $('.recipes .paging .page-list a').dataBind({ text: 'pageNumber',
                                                      click: '$root.views.recipeList.onPaging.bind($root.views.recipeList)',
                                                      css: { "'active'": '$root.views.recipeList.pageNumber() === pageNumber' }});

        $('.recipe-list').dataBind({ visible: 'true',
                                     foreach: "{ data: $root.views.recipeList.recipes, as: 'recipe' }"});

        $('.recipe-list-item').dataBind({ click: '$root.views.recipeList.onItemClick'});

        $('.recipe-list-item .buttons .delete').dataBind({ click: '$root.views.recipeList.onItemDeleting'});

        $('.recipe-list-item .name').dataBind({ text: 'recipe.name' });
        $('.recipe-list-item .description').dataBind({ text: 'recipe.description' });
        $('.recipe-list-item .photo').dataBind({ css: { "'empty'": '!recipe.photoPath()' } });
        $('.recipe-list-item .photo > img').dataBind({ attr: "{ 'src': recipe.photoPath }" });
        $('.recipe-list-item .popularity').dataBind({ editableNumber: 'recipe.popularity' });
        $('.recipe-list-item .complexity').dataBind({ editableNumber: 'recipe.complexity' });

        $('.recipes .spinner').dataBind({ css: { "'active'": '$root.views.recipeList.isLoading' }});

        // Recipe

        $('.recipe').dataBind({ visible: '$root.views.recipeCard.active',
                                css: { "'editing'": '$root.views.recipeCard.inEditMode()' }});
        $('body').dataBind({ escapeKeyPress: '$root.views.recipeCard.active() && $root.views.recipeCard.onClosing()' });

        $('.fog').dataBind({ visible: '$root.views.recipeCard.active' });

        $('.recipe .buttons .edit').dataBind({ visible: '!$root.views.recipeCard.inEditMode()',
                                               click: '$root.views.recipeCard.onEditing.bind($root.views.recipeCard)'});
        $('.recipe .buttons .save').dataBind({ visible: '$root.views.recipeCard.inEditMode',
                                               click: '$root.views.recipeCard.onSaving.bind($root.views.recipeCard)'});
        $('.recipe .buttons .discard').dataBind({ visible: '$root.views.recipeCard.inEditMode() && !$root.views.recipeCard.isNewRecipe()',
                                                  click: '$root.views.recipeCard.onDiscarding.bind($root.views.recipeCard)'});
        $('.recipe .buttons .delete').dataBind({ visible: '!$root.views.recipeCard.isNewRecipe()',
                                                 click: '$root.views.recipeCard.onDeleting.bind($root.views.recipeCard)'});
        $('.recipe .buttons .close').dataBind({ click: '$root.views.recipeCard.onClosing.bind($root.views.recipeCard)'});

        $('.recipe .name').dataBind({ editableText: '$root.views.recipeCard.recipe().name',
                                      contentEditable: '$root.views.recipeCard.inEditMode',
                                      contentSelect: '$root.views.recipeCard.isNewRecipe() && $root.views.recipeCard.inEditMode()',
                                      returnKeyPress: '$root.views.recipeCard.onSaving()',
                                      focusSelectContent: ''});
        $('.recipe .description').dataBind({ editableText: '$root.views.recipeCard.recipe().description',
                                             contentEditable: '$root.views.recipeCard.inEditMode',
                                             returnKeyPress: '$root.views.recipeCard.onSaving()',
                                             focusSelectContent: ''});
        $('.recipe .photo').dataBind({ click: "function() { $root.views.recipeCard.inEditMode() && $('.recipe .photo + input').click() }",
                                       css: { "'empty'": '!$root.views.recipeCard.recipe().photoPath()' }});
        $('.recipe .photo > img').dataBind({ attr: "{ 'src': $root.views.recipeCard.recipe().photoPath() }" });
        $('.recipe .photo > .delete').dataBind({ click: '$root.views.recipeCard.onRecipePhotoDeleting.bind($root.views.recipeCard)' });
        $('.recipe .photo + input').dataBind({ event: "{ change: function() { $root.views.recipeCard.onPhotoUploading($('.recipe .photo + input')[0].files[0]) } }" });
        $('.recipe .popularity').dataBind({ editableNumber: '$root.views.recipeCard.recipe().popularity',
                                            contentEditable: '$root.views.recipeCard.inEditMode',
                                            returnKeyPress: '$root.views.recipeCard.onSaving()',
                                            focusSelectContent: '' });
        $('.recipe .complexity').dataBind({ editableNumber: '$root.views.recipeCard.recipe().complexity',
                                            contentEditable: '$root.views.recipeCard.inEditMode',
                                            returnKeyPress: '$root.views.recipeCard.onSaving()',
                                            focusSelectContent: '' });
        $('.recipe .ingredients .ingredient-list').dataBind({ foreach: "{ data: $root.views.recipeCard.recipe().ingredients, as: 'ingredient' }" });
        $('.recipe .ingredients .ingredient-list-item .name').dataBind({ editableText: 'ingredient.name',
                                                                         contentEditable: '$root.views.recipeCard.inEditMode',
                                                                         returnKeyPress: '$root.views.recipeCard.onAddingIngredient()',
                                                                         focusSelectContent: ''});
        $('.recipe .ingredients .ingredient-list-item .delete').dataBind({ visible: '$root.views.recipeCard.inEditMode',
                                                                           click: '$root.views.recipeCard.onDeletingIngredient.bind($root.views.recipeCard)' });
        $('.recipe .ingredients .add').dataBind({ visible: '$root.views.recipeCard.inEditMode',
                                                  click: '$root.views.recipeCard.onAddingIngredient.bind($root.views.recipeCard)' });

        $('.recipe .steps .step-list').dataBind({ foreach: "{ data: $root.views.recipeCard.recipe().steps, as: 'step' }",
                                                  sortable: "{ draggableClass: 'step-list-item'," +
                                                            "  handleClass: 'drag-handle'," +
                                                            "  ghostClass: 'drag-ghost'," + 
                                                            "  onUpdate: $root.views.recipeCard.onDraggingStep.bind($root.views.recipeCard) }"});
        $('.recipe .steps .step-list-item .name').dataBind({ editableText: 'step.name',
                                                             contentEditable: '$root.views.recipeCard.inEditMode',
                                                             returnKeyPress: '$root.views.recipeCard.onAddingStep()',
                                                             focusSelectContent: ''});
        $('.recipe .steps .step-list-item .drag-handle').dataBind({ visible: '$root.views.recipeCard.inEditMode' });                                                             
        $('.recipe .steps .step-list-item .delete').dataBind({ visible: '$root.views.recipeCard.inEditMode',
                                                               click: '$root.views.recipeCard.onDeletingStep.bind($root.views.recipeCard)' });
        $('.recipe .steps .add').dataBind({ visible: '$root.views.recipeCard.inEditMode',
                                            click: '$root.views.recipeCard.onAddingStep.bind($root.views.recipeCard)' });
    }

    return {
        setupBindings: setupBindings
    }
});