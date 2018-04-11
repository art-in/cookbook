<template>
  <modal
    :visible="visible"
    @close="onRecipeFormModalClose">
    <recipe-form
      v-if="visible"
      :is-loading="$store.state.modal.isLoading"
      :is-editing="$store.state.modal.isEditing"
      :is-deletable="$store.state.modal.isDeletable"
      :is-cancelable="$store.state.modal.isCancelable"
      :recipe="$store.state.modal.recipe" />
  </modal>
</template>

<script>
import {mapActions} from 'vuex'

import Modal from './shared/Modal'
import RecipeForm from './RecipeForm'

export default {
  components: {
    Modal,
    RecipeForm
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    ...mapActions(['onRecipeFormModalClose'])
  }
}
</script>
