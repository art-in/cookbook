<template>
  <div class="recipe-list">
    <div class="header">
      <button class="add">+</button>
      <div class="sorters">
        TODO: sorting buttons
      </div>
    </div>
    <div class="items">
      <recipe-card
        v-for="recipe in $store.state.recipes"
        :key="recipe.id"
        :recipe="recipe"
        class="item" />
    </div>
    <div class="footer">
      TODO: paging buttons
    </div>
  </div>
</template>

<style scoped>
  .recipe-list {
    width: 900px;
    margin: auto;

    background-color: white;
    box-shadow: 0 0 10px gray;
    border-radius: 3px;
  }

  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;

    border-bottom: 1px solid #ddd;
  }

  .header button.add {}

  .items {
    padding: 10px 0;
  }

  .item + .item {
    border-top: 1px solid #eee;
    margin-top: 10px;
  }

  .footer {
    padding: 10px;
    border-top: 1px solid #ddd;
  }
</style>

<script>
import RecipeCard from './RecipeCard.vue'

export default {
  name: 'RecipeList',
  components: {
    RecipeCard
  }
}
</script>
