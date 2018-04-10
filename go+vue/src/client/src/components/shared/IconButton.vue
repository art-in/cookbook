<template>
  <icon
    :icon="icon"
    :size="size"
    class="icon-button"
    @click="onClick" />
</template>

<style scoped>
  .icon-button {
    cursor: pointer;
  }
</style>

<script>
import Icon from './Icon'

export default {
  name: 'IconButton',
  components: {Icon},
  props: {
    icon: {
      type: [Array, String],
      required: true
    },
    size: {
      type: String,
      default: null
    }
  },
  methods: {
    onClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>
