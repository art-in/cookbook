<template>
  <div class="recipe-form">
    <div
      v-if="!isLoaded"
      class="loading">
      <icon
        icon="spinner"
        spin
        size="2x" />
    </div>
    <recipe-card
      v-if="isLoaded"
      :recipe="recipe" />
  </div>
</template>

<style scoped>
  .recipe-form {}

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
</style>

<script>
import Icon from './shared/Icon'
import RecipeCard from './RecipeCard'

export default {
  name: 'RecipeForm',
  components: {
    RecipeCard,
    Icon
  },
  props: {
    recipe: {
      type: Object,
      required: false,
      default: null
    },
    isLoaded: {
      type: Boolean,
      required: true
    }
  }
}
</script>
