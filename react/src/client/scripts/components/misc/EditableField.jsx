define(['react'], function(React) {
  return React.createClass({
    
    propTypes: {
      tag: React.PropTypes.string,
      html: React.PropTypes.string,
      className: React.PropTypes.string,
      style: React.PropTypes.object,
      selectOnFocus: React.PropTypes.bool,
      onChange: React.PropTypes.func.isRequired,
      onReturn: React.PropTypes.func.isRequired
    },
    
    getDefaultProps: function() {
      return {
        tag: 'div',
        selectOnFocus: true
      };
    },
    
    getInitialState: function() {
      return {
        editHtml: ''
      };
    },
    
    componentDidMount: function() {
      this.setState({
        editHtml: this.props.html
      });
      this.lastHtml = this.props.html;
    },
    
    componentWillUnmount: function() {
      this.emitChange();
    },
    
    shouldComponentUpdate: function(nextProps, nextState){
      return nextState.editHtml !== this.getDOMNode().innerHTML;
    },
    
    onInput: function() {
      var html = this.getDOMNode().innerHTML;
      this.setState({
        editHtml: html
      });
    },
    
    onFocus: function() {
      if (this.props.selectOnFocus) {
        setTimeout(function() {
          var node = this.getDOMNode();
          var range = document.createRange();
          range.selectNodeContents(node);
  
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }.bind(this), 10);
      }
    },
    
    onKeyDown: function(e) {
      // 'Return'
      if (e.keyCode == 13 && !e.ctrlKey) {
        e.preventDefault();
        this.emitChange();
        this.props.onReturn();
      }
      
      // 'Return + CTRL'
      if (e.keyCode == 13 && e.ctrlKey) {
        e.preventDefault();
        document.execCommand('insertHTML', false, '<br><br>');
      }
    },
    
    emitChange: function(){
      var html = this.state.editHtml;
      if (this.lastHtml !== html) {
        this.props.onChange(html);
        this.lastHtml = html;
      }
    },
    
    render: function(){
      return React.createElement(this.props.tag, {
        contentEditable: true,
        className: this.props.className,
        style: this.props.style,
        dangerouslySetInnerHTML: {__html: this.state.editHtml},
        onInput: this.onInput,
        onFocus: this.onFocus,
        onKeyDown: this.onKeyDown,
        onBlur: this.emitChange
      });
    }
    
  });
});