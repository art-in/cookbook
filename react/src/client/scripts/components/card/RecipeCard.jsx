define(['react', 'co',
        'jsx!components/card/RecipeCardMin',
        'jsx!components/list/IngredientList',
        'jsx!components/list/StepList'],
  
  function(React, co, RecipeCardMin, IngredientList, StepList) {
    return React.createClass({
      
      propTypes: {
        recipe: React.PropTypes.object.isRequired,
        isEdit: React.PropTypes.bool.isRequired,
        isDeleteAvailable: React.PropTypes.bool.isRequired,
        isDiscardAvailable: React.PropTypes.bool.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onDiscard: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        onPhotoChange: React.PropTypes.func.isRequired
      },
      
      getInitialState: function() {
        return {
          recipe: this.props.recipe.clone()
        };
      },
      
      componentWillReceiveProps: function(nextProps) {
        this.setState({
          // Clone received recipe for further modifications
          recipe: nextProps.recipe.clone()
        });
      },
      
      onChange: function(recipe) {
        this.setState({ recipe: recipe });
      },
      
      onIngredientsChange: function(ingredients) {
        var recipe = this.state.recipe;
        recipe.ingredients = ingredients;
        this.setState({ recipe: recipe });
      },
      
      onStepsChange: function(steps) {
        var recipe = this.state.recipe;
        recipe.steps = steps;
        this.setState({ recipe: recipe });
      },
      
      onSave: function() {
        this.props.onSave(this.state.recipe);
      },
      
      onPhotoChange: co.wrap(function* (photoFile) {
        yield this.props.onPhotoChange(photoFile);
        
        var recipe = this.state.recipe;
        recipe.photoId = recipe.id;
        this.setState({ recipe: recipe });
      }),
      
      render: function() {
        return (
          <div style={ this.props.style }>
            <div className='fog'></div>
            <section className={ this.props.isEdit ? 'recipe editing' : 'recipe' }>
              <RecipeCardMin recipe={ this.state.recipe }
                             isEdit={ this.props.isEdit }
                             onChange={ this.onChange }
                             onSave={ this.onSave }
                             onPhotoChange= { this.onPhotoChange }/>
              
              <div className='buttons'>
                { !this.props.isEdit && (<a href='#' className='edit'
                                            onClick={ this.props.onEdit }  />) }
                { this.props.isEdit && (<a href='#' className='save'
                                           onClick={ this.onSave }/>) }
                { this.props.isEdit && this.props.isDiscardAvailable &&
                  (<a href='#' className='discard' onClick={ this.props.onDiscard }/>) }
                
                { this.props.isDeleteAvailable && 
                  (<a href='#' className='delete' onClick={ this.props.onDelete }/>) }
                
                <a href='#' className='close' onClick={ this.props.onClose }/>
              </div>
              
              <div className='specifics'>
                <IngredientList ingredients={ this.state.recipe.ingredients }
                                isEdit={ this.props.isEdit }
                                onChange={ this.onIngredientsChange } />
                <StepList steps={ this.state.recipe.steps }
                          isEdit={ this.props.isEdit }
                          onChange={ this.onStepsChange } />
              </div>
            </section>
          </div>
        );
      }
      
    });
  });