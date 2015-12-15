define(['react', 
        'jsx!components/list/RecipeListHeader',
        'jsx!components/list/RecipeListFooter',
        'jsx!components/card/RecipeCardMin'],
        
  function(React, RecipeListHeader, RecipeListFooter, RecipeCardMin) {
    return React.createClass({
      
      propTypes: {
        recipes: React.PropTypes.array.isRequired,
        recipesTotalCount: React.PropTypes.number.isRequired,
        pageSize: React.PropTypes.number.isRequired,
        sortProp: React.PropTypes.string.isRequired,
        pageNumber: React.PropTypes.number.isRequired,
        onRecipeSelect: React.PropTypes.func.isRequired,
        onRecipeDelete: React.PropTypes.func.isRequired,
        onRecipeAdd: React.PropTypes.func.isRequired,
        onSort: React.PropTypes.func.isRequired,
        onBack: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired,
        onMoveToPage: React.PropTypes.func.isRequired
      },
      
      render: function() {
        return (
          <section className='recipes'>
            <RecipeListHeader sortProp={ this.props.sortProp }
                              onRecipeAdd={ this.props.onRecipeAdd }
                              onSort={ this.props.onSort } />
            
            { 
              this.props.recipes.map(function(recipe) {
                return (
                  <RecipeCardMin key={ recipe.id }
                                 recipe={ recipe }
                                 isSelectable={ true }
                                 onSelect={ this.props.onRecipeSelect.bind(null, recipe) }
                                 onDelete={ this.props.onRecipeDelete.bind(null, recipe) }/>
                );
              }.bind(this))
            }
            
            <RecipeListFooter totalCount={ this.props.recipesTotalCount }
                              pageSize={ this.props.pageSize }
                              pageNumber={ this.props.pageNumber }
                              onBack={ this.props.onBack }
                              onNext={ this.props.onNext }
                              onMoveToPage={ this.props.onMoveToPage } />
            
            <div className="spinner"></div>
          </section>
        );
      }
      
    });
  });