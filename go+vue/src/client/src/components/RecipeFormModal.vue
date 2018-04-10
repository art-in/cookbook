<template>
  <modal
    :visible="visible"
    @close="onRecipeFormModalClose">
    <recipe-form
      v-if="visible"
      :is-loaded="isLoaded"
      :recipe="recipe" />
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
    recipe: {
      type: Object,
      required: false,
      default: null
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    isLoaded: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    ...mapActions(['onRecipeFormModalClose'])
  }
}
</script>
