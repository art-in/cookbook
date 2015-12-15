define(['react',
        'jsx!components/misc/EditableField'],
  
  function(React, EditableField) {
    return React.createClass({
      
      propTypes: {
        ingredients: React.PropTypes.array.isRequired,
        isEdit: React.PropTypes.bool,
        onChange: React.PropTypes.func.isRequired
      },
      
      onIngredientChange: function(ingredientIdx, value) {
        var ingredients = this.props.ingredients;
        ingredients[ingredientIdx] = value;
        this.props.onChange(ingredients);
      },
      
      onIngredientDelete: function(ingredientIdx) {
        var ingredients = this.props.ingredients;
        ingredients.splice(ingredientIdx, 1);
        this.props.onChange(ingredients);
      },
      
      onIngredientAdd: function() {
        var ingredients = this.props.ingredients;
        ingredients.push('Новый ингредиент');
        this.props.onChange(ingredients);
      },
      
      render: function() {
        return (
          <div className='ingredients'>
            <div className='title'>
              Ингредиенты: 
              {
                this.props.isEdit && 
                  <a href='#' className='add' onClick={ this.onIngredientAdd } />
              }
            </div>
            <ul className='ingredient-list'>
              {
                this.props.ingredients.map(function(ingredient, idx) {
                  return (
                    <li key={ idx } className='ingredient-list-item'>
                      {
                        this.props.isEdit
                          ? <EditableField className='name'
                                           html={ ingredient }
                                           onChange={ this.onIngredientChange.bind(null, idx) }
                                           onReturn={ this.onIngredientAdd } />
                          : <div className='name'>{ ingredient }</div>
                      }
                      
                      {
                        this.props.isEdit &&
                          <div className='controls'>
                            <a href='#' className='delete'
                               onClick={ this.onIngredientDelete.bind(null, idx) }>
                            </a>
                          </div>
                      }
                    </li>
                  );
                }.bind(this))
              }
            </ul>
          </div>
        );
      }
    });
  });