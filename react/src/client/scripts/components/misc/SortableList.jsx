define(['react', 'react-sortable-mixin',
        'jsx!components/misc/EditableField'],
        
  function(React, SortableMixin, EditableField) {
    return React.createClass({
      
      mixins: [SortableMixin],
      
      propTypes: {
        items: React.PropTypes.array.isRequired,
        itemClassName: React.PropTypes.string,
        isEdit: React.PropTypes.bool.isRequired,
        onItemChange: React.PropTypes.func.isRequired,
        onItemDelete: React.PropTypes.func.isRequired,
        onReturn: React.PropTypes.func.isRequired,
        onSort: React.PropTypes.func.isRequired
      },
      
      getInitialState: function() {
        return {
          items: this.props.items
        };
      },
      
      componentWillReceiveProps: function(nextProps) {
        this.setState({
          items: nextProps.items
        });
      },
      
      sortableOptions: {
        model: 'items',
        handle: '.drag-handle',
        ghostClass: 'drag-ghost',
        onSort: 'onSort'
      },
      
      onSort: function() {
        this.props.onSort(this.state.items);
      },
      
      render: function() {
        return (
          <ol>
          {
            this.state.items.map(function(item, idx) {
              return (
                <li key={ item } className={ this.props.itemClassName }>
                  {
                    this.props.isEdit
                    ? <EditableField className='name'
                                     html={ item }
                                     onChange={ this.props.onItemChange.bind(null, idx) }
                                     onReturn={ this.props.onReturn } />
                    : <div className='name'>{ item }</div>
                  }
                  
                  <div className='controls'
                    style={{ display: this.props.isEdit ? 'inline-block' : 'none' }}>
                    <a href='#' className='delete'
                       onClick={ this.props.onItemDelete.bind(null, idx) }>
                    </a>
                    <span className='drag-handle'> ||| </span>
                  </div>
                </li>
              );
            }.bind(this))
          }
          </ol>
        );
      }
        
    });
    
  });