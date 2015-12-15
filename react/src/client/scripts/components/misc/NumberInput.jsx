define(['react',
        'jsx!components/misc/EditableField'],
  function(React, EditableField) {
    return React.createClass({
      
      propTypes: {
        className: React.PropTypes.string,
        value: React.PropTypes.number,
        max: React.PropTypes.number,
        min: React.PropTypes.number,
        onChange: React.PropTypes.func,
        onReturn: React.PropTypes.func
      },
      
      getDefaultProps: function() {
        return {
          max: Number.POSITIVE_INFINITY,
          min: 0
        };
      },
      
      onFieldChange: function(value) {
        var num;
        if (isFinite(value)) {
          num = parseInt(value, 10);
          if (num < this.props.min) num = this.props.min;
          if (num > this.props.max) num = this.props.max;
        } else {
          num = this.props.min;
        }
        
        this.props.onChange(num);
      },
      
      render: function() {
        return (
          <EditableField tag='span'
                         className={ this.props.className }
                         html={ this.props.value.toString() }
                         onChange={ this.onFieldChange }
                         onReturn={ this.props.onReturn }/>
        );
      }
      
    });
  });