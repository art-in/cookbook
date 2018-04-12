<template>
  <div class="recipe-list">
    <div class="header">
      <icon-button
        icon="plus-circle"
        size="lg"
        title="Add new recipe"
        @click="onAdd" />
      <btn-group class="sorters">
        <btn
          :active="sortProp == 'name'"
          @click.native="onSort('name')">
          by alphabet
        </btn>
        <btn
          :active="sortProp == 'complexity'"
          @click.native="onSort('complexity')">
          by complexity
        </btn>
        <btn
          :active="sortProp == 'popularity'"
          @click.native="onSort('popularity')">
          by popularity
        </btn>
      </btn-group>
    </div>
    <div class="items">
      <div
        v-if="isEmpty"
        class="empty">
        No recipes yet
      </div>
      <div v-if="!isEmpty">
        <recipe-card
          v-for="recipe in $store.state.recipes.items"
          :key="recipe.id"
          :recipe="recipe"
          :is-deletable="true"
          class="item"
          @click.native="onItemClick(recipe)"
          @delete="onItemDelete"
        />
      </div>
      <waiter v-if="$store.state.recipes.isLoading" />
    </div>
    <div class="footer">
      TODO: paging buttons
    </div>

    <recipe-form-modal :visible="$store.state.modal.isVisible" />
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

  .items {
    position: relative;
    min-height: 100px;
  }

  .items .empty {
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
import IconButton from './shared/IconButton'
import Btn from './shared/Btn'
import BtnGroup from './shared/BtnGroup'
import Waiter from './shared/Waiter'
import RecipeCard from './RecipeCard'
import RecipeFormModal from './RecipeFormModal'

export default {
  name: 'RecipeList',
  components: {
    Icon,
    IconButton,
    Btn,
    BtnGroup,
    Waiter,
    RecipeCard,
    RecipeFormModal
  },
  computed: {
    isEmpty (cmp) {
      const items = cmp.$store.state.recipes.items
      return !items || items.length === 0
    },
    sortProp (cmp) {
      return cmp.$store.state.recipes.sortProp
    }
  },
  methods: {
    ...mapActions({
      onAdd: 'onRecipeListAdd',
      onItemClick: 'onRecipeListItemClick',
      onItemDelete: 'onRecipeListItemDelete',
      onSort: 'onRecipeListSort'
    })
  }
}
</script>
