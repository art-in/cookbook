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
        v-if="isEditing"
        icon="eraser"
        title="Cancel"
        class="action"
        @click.native="onCancel" />
    </div>
    <recipe-card
      v-if="isLoaded"
      :recipe="recipe"
      :is-editing="isEditing" />
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

  .actions {
    position: absolute;
    right: 40px;
    top: 10px;
  }

  .actions .action + .action {
    margin-left: 15px;
  }

  .action {
    color: gray;
  }

  .action:hover {
    color: black;
  }
</style>

<script>
import {mapActions} from 'vuex'

import Icon from './shared/Icon'
import IconButton from './shared/IconButton'
import RecipeCard from './RecipeCard'

export default {
  name: 'RecipeForm',
  components: {
    RecipeCard,
    Icon,
    IconButton
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
    },
    isEditing: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    ...mapActions({
      onEdit: 'onRecipeFormEdit',
      onSave: 'onRecipeFormSave',
      onCancel: 'onRecipeFormCancel'
    })
  }
}
</script>
