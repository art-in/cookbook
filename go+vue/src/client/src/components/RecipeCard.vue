<template>
  <div class="recipe-card">
    <div class="image-container">TODO: image</div>
    <div class="props">
      <input
        v-model="recipe.name"
        :readonly="!isEditing"
        class="name">
      <textarea
        v-model="recipe.description"
        :readonly="!isEditing"
        class="description" />
      <div class="numbers">
        <span
          class="complexity"
          title="Complexity">
          <icon :icon="['far', 'clock']" />
          <input
            v-model.number="recipe.complexity"
            :readonly="!isEditing"
            type="number"
            min="1"
            max="10">
        </span>
        <span
          class="popularity"
          title="Popularity">
          <icon :icon="['far', 'smile']" />
          <input
            v-model.number="recipe.popularity"
            :readonly="!isEditing"
            type="number"
            min="1"
            max="10">
        </span>
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

  .name {
    font-size: 1.5rem;
    margin-bottom: 10px;
    width: 450px;
  }

  textarea.description {
    margin-bottom: 10px;
    color: gray;
    width: 550px;
  }

  textarea.description:not(:read-only) {
    resize: vertical;
  }

  .numbers {
    color: gray;
  }

  .numbers > span + span {
    margin-left: 10px;
  }

  .numbers input[type=number] {
    width: 50px;
  }

</style>

<script>
import Icon from './shared/Icon'

export default {
  name: 'RecipeCard',
  components: {
    Icon
  },
  props: {
    recipe: {
      type: Object,
      required: true
    },
    isEditing: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
