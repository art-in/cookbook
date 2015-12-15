define(['react',
        'lib/helpers',
        'jsx!components/misc/SortableList'],
        
  function(React, helpers, SortableList) {
    return React.createClass({
      
      propTypes: {
        steps: React.PropTypes.array.isRequired,
        isEdit: React.PropTypes.bool
      },
      
      onStepChange: function(stepIdx, value) {
        var steps = this.props.steps;
        steps[stepIdx] = value;
        this.props.onChange(steps);
      },
      
      onStepDelete: function(stepIdx) {
        var steps = this.props.steps;
        steps.splice(stepIdx, 1);
        this.props.onChange(steps);
      },
      
      onStepAdd: function() {
        var newStep = 'Новый шаг';
        if (this.props.steps.indexOf(newStep) === -1) {
          var steps = this.props.steps;
          steps.push(newStep);
          this.props.onChange(steps);
        }
      },
      
      render: function() {
        
        return (
          <div className='steps'>
            <div className='title'>
              Шаги:
              {
                this.props.isEdit && 
                  <a href='#' className='add' onClick={ this.onStepAdd } />
              }
            </div>
            <SortableList className={ 'step-list' }
                          itemClassName={ 'step-list-item' }
                          items={ this.props.steps }
                          isEdit={ this.props.isEdit }
                          onItemChange={ this.onStepChange }
                          onItemDelete={ this.onStepDelete }
                          onReturn={ this.onStepAdd }
                          onSort={ this.props.onChange }/>
          </div>
        );
      }
    });
  });