define(['react'], function(React) {
  return React.createClass({
    
    propTypes: {
      totalCount: React.PropTypes.number.isRequired,
      pageSize: React.PropTypes.number.isRequired,
      pageNumber: React.PropTypes.number.isRequired,
      onBack: React.PropTypes.func.isRequired,
      onNext: React.PropTypes.func.isRequired,
      onMoveToPage: React.PropTypes.func.isRequired
    },
    
    getPageCount: function() {
      return Math.ceil(this.props.totalCount / this.props.pageSize);
    },
    
    onPageClick: function(pageNumber) {
      if (this.props.pageNumber !== pageNumber) {
        this.props.onMoveToPage(pageNumber);
      }
    },
    
    render: function() {
      var pageNumbers = [];
      for(var i=0; i < this.getPageCount(); i++) {
        pageNumbers.push(
          <li key={ i }>
            <a href="#"
               onClick={ this.onPageClick.bind(null, i) }
               className={ this.props.pageNumber === i ? 'active' : '' }>
              {i+1}
            </a>
          </li>
        );
      }
      
      return (
        <div className="paging">
          <a href="#" className="prev"
             onClick={ this.props.onBack }>
             Назад
          </a>
          <ul className="page-list">
            {pageNumbers}
          </ul>
          <a href="#" className="next"
             onClick={ this.props.onNext }>
             Вперёд
          </a>
        </div>
      );
    }
  });
});