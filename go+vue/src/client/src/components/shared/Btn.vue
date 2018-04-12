<template>
  <button :class="{active:active}">
    <slot />
  </button>
</template>

<style scoped>
  button {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    border-radius: 4px;
    user-select: none;

    color: #333;
    background-color: #fff;
    border-color: #ccc;

    outline: none;
  }

  button:hover {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }

  button.active {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;

    background-image: none;
    box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
  }

  button:disabled {
    cursor: default;
  }
</style>

<script>
export default {
  name: 'Btn',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>
