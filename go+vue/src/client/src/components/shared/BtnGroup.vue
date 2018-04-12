<style scoped>
  .btn-group {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }

  .btn-group > .btn-group-item:first-child:not(:last-child) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .btn-group > .btn-group-item:last-child:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .btn-group > .btn-group-item:not(:first-child):not(:last-child) {
      border-radius: 0;
  }

  .btn-group > .btn-group-item {
    position: relative;
    float: left;

    margin-left: -1px;
  }
</style>

<script>
export default {
  name: 'BtnGroup',
  render: function (createElement) {
    const childs = this.$slots.default || []
    childs.forEach(child => {
      if (child.text === ' ') {
        // skip text nodes
        return
      }

      // restrict children types
      if (!child.componentOptions || child.componentOptions.tag !== 'btn') {
        throw Error(`Only children of 'btn' component type allowed inside button group.`)
      }

      // add class to all child items to ensure we styling them without
      // guessing their tag/class
      child.data = child.data || {}
      child.data.staticClass = child.data.staticClass
        ? child.data.staticClass + ' ' : ''
      child.data.staticClass += 'btn-group-item'
    })

    return createElement(
      'span',
      {
        class: 'btn-group'
      },
      childs
    )
  }
}
</script>
