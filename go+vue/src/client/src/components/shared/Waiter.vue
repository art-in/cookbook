<template>
  <div
    class="waiter">
    <div class="back" />
    <icon
      icon="spinner"
      spin
      size="2x"
      class="spinner" />
  </div>
</template>

<style scoped>
  .waiter {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .waiter .back {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: black;
    opacity: 0.15;
  }

  .waiter .spinner {
    color: white;
  }
</style>

<script>
import Icon from './Icon'

export default {
  name: 'Waiter',
  components: {
    Icon
  }
}
</script>
