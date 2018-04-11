<template>
  <modal
    :visible="visible"
    @close="onRecipeFormModalClose">
    <recipe-form
      v-if="visible"
      :is-loaded="$store.state.modal.isLoaded"
      :is-editing="$store.state.modal.isEditing"
      :recipe="$store.state.modal.recipe" />
  </modal>
</template>

<style scoped>

</style>
  .recipe-form-modal {

  }
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
