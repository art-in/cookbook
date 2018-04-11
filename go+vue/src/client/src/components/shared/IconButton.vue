<template>
  <icon
    :icon="icon"
    :size="size"
    :title="title"
    class="icon-button"
    @click="onClick" />
</template>

<style scoped>
  .icon-button {
    cursor: pointer;
    color: gray;
  }

  .icon-button:hover {
    color: black;
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
    },
    title: {
      type: String,
      required: false,
      default: undefined
    }
  },
  methods: {
    onClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>
