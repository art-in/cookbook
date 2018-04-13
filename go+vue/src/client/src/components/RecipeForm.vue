<template>
  <div class="recipe-form">
    <recipe-card
      v-if="recipe"
      :recipe="recipe"
      :is-editing="isEditing" />

    <list
      v-if="recipe"
      :items="recipe.ingredients"
      :is-editing="isEditing"
      class="ingredients"
      @item-add="onIngredientAdd"
      @item-delete="onIngredientDelete"
    >
      <template slot="title">
        Ingredients:
      </template>
      <template
        slot="item"
        slot-scope="scopeProps">
        <input
          v-model="scopeProps.item.description"
          :readonly="!isEditing"
          class="ingredient">
      </template>
    </list>

    <list
      v-if="recipe"
      :items="recipe.steps"
      :is-editing="isEditing"
      :is-ordered="true"
      class="steps"
      @item-add="onStepAdd"
      @item-delete="onStepDelete"
    >
      <template slot="title">
        Steps:
      </template>
      <template
        slot="item"
        slot-scope="scopeProps">
        <input
          v-model="scopeProps.item.description"
          :readonly="!isEditing"
          class="step">
      </template>
    </list>

    <div class="actions">
      <icon-button
        v-if="!isEditing"
        icon="pencil-alt"
        title="Edit"
        class="action"
        @click.native="onEdit" />
      <icon-button
        v-if="isEditing"
        icon="save"
        title="Save"
        class="action"
        @click.native="onSave" />
      <icon-button
        v-if="isCancelable && isEditing"
        icon="eraser"
        title="Cancel"
        class="action"
        @click.native="onCancel" />
      <icon-button
        v-if="isDeletable"
        icon="trash-alt"
        title="Delete"
        class="action"
        @click.native="onDelete(recipe)" />
    </div>
    <waiter v-if="isLoading" />
  </div>
</template>

<style scoped>
  .recipe-form {
    min-height: 150px;
    position: relative;
  }

  .actions {
    position: absolute;
    right: 40px;
    top: 10px;
  }

  .actions .action + .action {
    margin-left: 15px;
  }

  .ingredients,
  .steps {
    margin: 15px 15px 0 190px;
    text-align: left;
  }

  input.ingredient,
  input.step {
    width: 350px;
  }
</style>

<script>
import {mapActions} from 'vuex'

import Icon from './shared/Icon'
import IconButton from './shared/IconButton'
import Waiter from './shared/Waiter'
import List from './shared/List'
import RecipeCard from './RecipeCard'

export default {
  name: 'RecipeForm',
  components: {
    Icon,
    IconButton,
    Waiter,
    List,
    RecipeCard
  },
  props: {
    recipe: {
      type: Object,
      required: false,
      default: null
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    isEditing: {
      type: Boolean,
      required: true
    },
    isDeletable: {
      type: Boolean,
      required: true
    },
    isCancelable: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    ...mapActions({
      onEdit: 'onRecipeFormEdit',
      onSave: 'onRecipeFormSave',
      onCancel: 'onRecipeFormCancel',
      onDelete: 'onRecipeFormDelete',
      onIngredientAdd: 'onRecipeFormIngredientAdd',
      onIngredientDelete: 'onRecipeFormIngredientDelete',
      onStepAdd: 'onRecipeFormStepAdd',
      onStepDelete: 'onRecipeFormStepDelete'
    })
  }
}
</script>
