<template>
  <div class="recipe-list">
    <div class="header">
      <button class="add">+</button>
      <div class="sorters">
        TODO: sorting buttons
      </div>
    </div>
    <div class="items">
      <div
        v-if="!$store.state.recipes.isLoaded"
        class="loading">
        <icon
          icon="spinner"
          spin
          size="2x" />
      </div>
      <recipe-card
        v-for="recipe in $store.state.recipes.items"
        :key="recipe.id"
        :recipe="recipe"
        class="item"
        @click.native="onRecipeListItemClick(recipe)"
      />
    </div>
    <div class="footer">
      TODO: paging buttons
    </div>

    <recipe-form-modal
      :visible="$store.state.modal.isVisible"
      :is-loaded="$store.state.modal.isLoaded"
      :recipe="$store.state.modal.recipe" />
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

  .items {}

  .items .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
  }

  .item + .item {
    border-top: 1px solid #eee;
  }

  .item {
    cursor: pointer;
  }

  .item:hover {
    background-color: #efefef;
  }

  .footer {
    padding: 10px;
    border-top: 1px solid #ddd;
  }
</style>

<script>
import {mapActions} from 'vuex'
import Icon from './shared/Icon'
import RecipeCard from './RecipeCard'
import RecipeFormModal from './RecipeFormModal'

export default {
  name: 'RecipeList',
  components: {
    Icon,
    RecipeCard,
    RecipeFormModal
  },
  methods: {
    ...mapActions([
      'onRecipeListItemClick'
    ])
  }
}
</script>
