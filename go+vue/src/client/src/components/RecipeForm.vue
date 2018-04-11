<template>
  <div class="recipe-form">
    <recipe-card
      v-if="recipe"
      :recipe="recipe"
      :is-editing="isEditing" />
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
</style>

<script>
import {mapActions} from 'vuex'

import Icon from './shared/Icon'
import IconButton from './shared/IconButton'
import Waiter from './shared/Waiter'
import RecipeCard from './RecipeCard'

export default {
  name: 'RecipeForm',
  components: {
    RecipeCard,
    Icon,
    IconButton,
    Waiter
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
      onDelete: 'onRecipeFormDelete'
    })
  }
}
</script>
