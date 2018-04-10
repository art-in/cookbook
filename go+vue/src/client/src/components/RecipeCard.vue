<template>
  <div class="recipe-card">
    <div class="image-container">TODO: image</div>
    <div class="props">
      <div class="name">{{ recipe.name }}</div>
      <div class="description">{{ recipe.description }}</div>
      <div class="numbers">
        <span class="complexity">{{ recipe.complexity }}</span>
        <span class="popularity">{{ recipe.popularity }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .recipe-card {
    display: flex;
    padding: 10px;
  }

  .image-container {
    margin-right: 15px;
    flex: 1;
  }

  .props {
    display: flex;
    flex-direction: column;
    flex: 3;
    align-items: flex-start;
    line-height: 25px;
  }
</style>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
}
</script>
