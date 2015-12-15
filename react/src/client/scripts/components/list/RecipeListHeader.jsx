define(['react'], function(React) {
  return React.createClass({
    
    propTypes: {
      sortProp: React.PropTypes.string.isRequired,
      onRecipeAdd: React.PropTypes.func.isRequired,
      onSort: React.PropTypes.func.isRequired
    },
    
    render: function() {
      
      var sorters = [
        { title: 'по алфавиту', prop: 'name' },
        { title: 'по сложности', prop: 'complexity' },
        { title: 'по популярности', prop: 'popularity' },
      ];
      
      return (
        <header>
          <a className='add' href='#'
            onClick={ this.props.onRecipeAdd }/>
          
          <div className='sorting'>
            {
              sorters.map(function(sorter) {
                return (
                  <a href='#' key={ sorter.prop }
                     onClick={ this.props.onSort.bind(null, sorter.prop) }
                     className={ this.props.sortProp === sorter.prop ? 'active' : '' }>
                    { sorter.title }
                  </a>
                );
              }.bind(this))
            }
          </div>
        </header>
      );
    }
    
  });
});