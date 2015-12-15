define(['react', 'jquery',
        'jsx!components/misc/EditableField',
        'jsx!components/misc/NumberInput'],
  
  function(React, $, EditableField, NumberInput) {
    return React.createClass({
      
      propTypes: {
        recipe: React.PropTypes.object.isRequired,
        isEdit: React.PropTypes.bool,
        isSelectable: React.PropTypes.bool,
        onSelect: React.PropTypes.func,
        onDelete: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onSave: React.PropTypes.func,
        onPhotoChange: React.PropTypes.func
      },
      
      onChangeName: function(name) {
        var recipe = this.props.recipe;
        recipe.name = name;
        this.props.onChange(recipe);
      },
      
      onChangeDescription: function(description) {
        var recipe = this.props.recipe;
        recipe.description = description;
        this.props.onChange(recipe);
      },
      
      onChangePopularity: function(popularity) {
        var recipe = this.props.recipe;
        recipe.popularity = popularity;
        this.props.onChange(recipe);
      },
      
      onChangeComplexity: function(complexity) {
        var recipe = this.props.recipe;
        recipe.complexity = complexity;
        this.props.onChange(recipe);
      },
      
      onPhotoClick: function(e) {
        if (this.props.isEdit) {
          $(arguments[0].currentTarget).find('input').click();
        }
      },
      
      onPhotoChange: function(e) {
        this.props.onPhotoChange(e.currentTarget.files[0]);
      },
      
      render: function() {
        return (
          <article className={ this.props.isSelectable 
                               ? 'recipe-card-min selectable'
                               : 'recipe-card-min'}
                   onClick={ this.props.onSelect }>
            <div className='buttons'>
              <a href='#' className='delete' 
                 src={ 'images/recipes/' + this.props.recipe.photoId }
                 onClick={ stopPropagation(this.props.onDelete) }/>
            </div>
            <div className='photo' className={ this.props.recipe.photoId ? 'photo' : 'photo empty' }
                 onClick={ this.onPhotoClick }>
              {
                this.props.recipe.photoId &&
                  <img src={ 'images/recipes/' + this.props.recipe.photoId } />
              }
              {
                this.props.isEdit &&
                  <input type="file" accept="image/*" 
                         onChange={ this.onPhotoChange } />
              }
            </div>
            <div className='properties'>
              {
                this.props.isEdit
                  ? <EditableField tag='span'
                                   className='name'
                                   html={ this.props.recipe.name }
                                   onChange={ this.onChangeName }
                                   onReturn={ this.props.onSave } />
                  : <a className='name'>{ this.props.recipe.name }</a>
              }
              
              <br/>
              <div className='metrics'>
                Популярность:
                {
                  this.props.isEdit
                    ? <NumberInput className='popularity'
                                   value={ this.props.recipe.popularity }
                                   onChange={ this.onChangePopularity }
                                   onReturn={ this.props.onSave }
                                   max={ 10 } />
                    : <span className='popularity'>{ this.props.recipe.popularity }</span>
                }
                
                Сложность: 
                {
                  this.props.isEdit
                    ? <NumberInput className='complexity'
                                   value={ this.props.recipe.complexity }
                                   onChange={ this.onChangeComplexity }
                                   onReturn={ this.props.onSave }
                                   max={ 10 } />
                    : <span className='complexity'>{ this.props.recipe.complexity }</span>
                }
              </div>
              
              {
                this.props.isEdit
                  ? <EditableField className='description'
                                   html={ this.props.recipe.description }
                                   onChange={ this.onChangeDescription }
                                   onReturn={ this.props.onSave } />
                  : <div className='description' 
                         dangerouslySetInnerHTML={{__html: this.props.recipe.description }}>
                    </div>
              }
            </div>
          </article>
        );
      }
      
    });
    
    function stopPropagation(handler) {
      return function(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        handler();
      };
    }
  });