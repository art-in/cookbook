require(['react', 'co',
         'transport/apiAgent', 'mappers/modelMapper',
         'models/Recipe',
         'jsx!components/list/RecipeList',
         'jsx!components/card/RecipeCard'],
  
  function(React, co, apiAgent, modelMapper, Recipe, RecipeList, RecipeCard) {
    
    var App = React.createClass({
      
      getInitialState: function() {
        // main app state
        // 
        // child components shape app state by ascending events
        // app state shape child components by descending props
        //
        // note: when state is even bigger it make sense to move
        // it to separate view-model (or hierarchy of view models), 
        // with all the supply methods (add, delete, etc) and 
        // notifying main component about model changes to re-render.
        return {
          recipes: [],
          recipesTotalCount: 0,
          selectedRecipe: null,
          isEditRecipe: false,
          isNewRecipe: false,
          pageSize: 4,
          pageNumber: 0,
          sortProp: 'name',
          sortDirection: 1
        };
      },
      
      componentDidMount: function() {
        this.reloadRecipes();
      },
      
      reloadRecipes: co.wrap(function* () {
  
        var pageSize = this.state.pageSize;
        var pageNumber = this.state.pageNumber;
        var sortProp = this.state.sortProp;
        var sortDirection = this.state.sortDirection;
  
        var data = yield apiAgent.getRecipes({
          skip: (pageNumber === 0) ? 0 : (pageNumber) * pageSize,
          limit: pageSize,
          sortProp: sortProp,
          sortDirection: sortDirection
        });
        
        var total = data.total;
        var recipeDOs = data.recipes;
  
        var recipes = modelMapper.mapRecipes(recipeDOs);
        
        this.setState({
          recipes: recipes,
          recipesTotalCount: total,
          pageNumber: pageNumber,
          sortProp: sortProp,
          sortDirection: sortDirection
        });
      }),
      
      getRecipeById: function(recipeId) {
        var recipe = this.state.recipes.filter(function(r) { return r.id === recipeId })[0];
        if (!recipe) throw new Error('No recipe with such id: ' + recipeId);
        return recipe;
      },
      
      getPageCount: function() {
        return Math.ceil(this.state.recipesTotalCount / this.state.pageSize);
      },
      
      onRecipeSelect: function(recipe) {
        this.setState({
          selectedRecipe: recipe,
          isEditRecipe: false,
          isNewRecipe: false
        });
      },
      
      onRecipeDelete: co.wrap(function* (recipe) {
        yield apiAgent.deleteRecipe(recipe.id);
        this.reloadRecipes();
      }),
      
      onRecipeAdd: function() {
        var recipe = new Recipe();
        recipe.name = 'Новый рецепт';
        recipe.description = 'Описание';
        
        this.setState({
          selectedRecipe: recipe,
          isEditRecipe: true,
          isNewRecipe: true
        });
      },
      
      onRecipeCardEdit: function() {
        this.setState({ isEditRecipe: true });
      },
      
      onRecipeCardSave: co.wrap(function* (recipe) {
        if (this.state.isNewRecipe) {
          this.setState({ selectedRecipe: null });
          yield apiAgent.addRecipe(recipe);
          this.reloadRecipes();
        } else {
          this.setState({
            selectedRecipe: recipe,
            isEditRecipe: false
          });
          
          // Do not send update if it was not changed
          if (!recipe.equals(this.getRecipeById(recipe.id))) {
            yield apiAgent.updateRecipe(recipe.id, recipe);
            this.reloadRecipes();
          }
        }
      }),
      
      onRecipeCardDiscard: function() {
        var recipeId = this.state.selectedRecipe.id;
        var recipe = this.getRecipeById(recipeId);
        
        this.setState({
          selectedRecipe: recipe,
          isEditRecipe: false,
          isNewRecipe: false
        });
      },
      
      onRecipeCardDelete: co.wrap(function* () {
        this.setState({ selectedRecipe: null });
        yield apiAgent.deleteRecipe(this.state.selectedRecipe.id);
        this.reloadRecipes();
      }),
      
      onRecipeCardClose: function() {
        this.setState({ selectedRecipe: null });
      },
      
      onRecipeSort: function(sortProp) {
        if (this.state.sortProp === sortProp) {
          this.state.sortDirection = this.state.sortDirection == 1 ? -1 : 1;
        } else {
          this.state.sortProp = sortProp;
          this.state.sortDirection = 1;
        }
        this.reloadRecipes();
      },
      
      onBack: function() {
        if (this.state.pageNumber > 0) {
          this.state.pageNumber--;
          this.reloadRecipes();
        }
      },
      
      onNext: function() {
        if (this.state.pageNumber < this.getPageCount() - 1) {
          this.state.pageNumber++;
          this.reloadRecipes();
        }
      },
      
      onMoveToPage: function(pageNumber) {
        this.state.pageNumber = pageNumber;
        this.reloadRecipes();
      },
      
      onRecipePhotoChange: co.wrap(function* (photoFile) {
        if (!photoFile) return; // File dialog was canceled
        var recipe = this.state.selectedRecipe;
        yield apiAgent.uploadRecipePhoto(recipe.id, photoFile);
      }),
      
      // render() defines how component should look like in declarative way:
      // contrary to imperative way, we do not need previous state to manually
      // mutate DOM to new state. We just define how it should look depending
      // on current state, and React will handle mutation part with minimum
      // DOM changes for us (using 'Virtual DOM' to find diffs under the hood).
      render: function() {
        return (
          <div>
            <RecipeList recipes={ this.state.recipes }
                        recipesTotalCount={ this.state.recipesTotalCount }
                        pageSize={ this.state.pageSize }
                        pageNumber={ this.state.pageNumber }
                        sortProp={ this.state.sortProp }
                        onRecipeSelect={ this.onRecipeSelect }
                        onRecipeDelete={ this.onRecipeDelete }
                        onRecipeAdd={ this.onRecipeAdd }
                        onSort={ this.onRecipeSort }
                        onBack={ this.onBack }
                        onNext={ this.onNext }
                        onMoveToPage={ this.onMoveToPage }/>
            {
              this.state.selectedRecipe &&
                <RecipeCard recipe={ this.state.selectedRecipe }
                            style={{ display: this.state.selectedRecipe ? 'block' : 'none' }}
                            isEdit={ this.state.isEditRecipe }
                            isDeleteAvailable= { !this.state.isNewRecipe }
                            isDiscardAvailable= { !this.state.isNewRecipe }
                            onChange={ this.onRecipeChange }
                            onEdit={ this.onRecipeCardEdit }
                            onSave={ this.onRecipeCardSave }
                            onDiscard={ this.onRecipeCardDiscard }
                            onDelete={ this.onRecipeCardDelete }
                            onClose={ this.onRecipeCardClose }
                            onPhotoChange={ this.onRecipePhotoChange }/>
            }
          </div>
        );
      }
      
    });
    
    function render() {
      React.render(React.createElement(App), document.body);
    }
    
    render();
  });