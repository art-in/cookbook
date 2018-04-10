<template>
  <div
    :class="{visible}"
    class="modal-container">
    <div
      class="modal-back"
      @click="onClose" />
    <div
      class="modal"
    >
      <icon-button
        icon="times"
        class="close"
        @click="onClose" />

      <slot />
    </div>
  </div>
</template>

<style scoped>
  .modal-container:not(.visible) {
    visibility: hidden;
  }

  .modal-container:not(.visible) .modal-back {
    opacity: 0;
  }

  .modal-container,
  .modal-back {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .modal-back {
    background-color: black;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .modal {
    position: absolute;
    width: 800px;
    right: 0;
    left: 0;
    margin: 90px auto;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 0 5px #0005;
  }

  .modal .close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>

<script>
import IconButton from './IconButton'

export default {
  name: 'Modal',
  components: {
    IconButton
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>
