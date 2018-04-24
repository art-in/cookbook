<template>
  <div
    :class="{editing: isEditing}"
    class="recipe-card">
    <div
      v-if="isDeletable"
      class="actions">
      <icon-button
        icon="trash-alt"
        title="Delete"
        class="action"
        @click.native.stop="onDelete(recipe)" />
    </div>
    <div
      :class="{empty: !recipe.hasImage}"
      class="image-container"
      @click="onImageClick(recipe)">
      <img
        v-if="recipe.hasImage"
        :src="recipe.imageSrc"
        :alt="recipe.name">
      <div
        v-if="!recipe.hasImage"
        class="image-stub">
        {{ isEditing ? '(click to set image)' : '(no image yet)' }}
      </div>
      <icon-button
        v-if="isEditing && recipe.hasImage"
        icon="trash-alt"
        class="delete-image"
        @click.native.stop="onImageDelete(recipe)" />
      <input
        v-if="isEditing"
        ref="imageInput"
        type="file"
        @change="onImageChange">
    </div>
    <div class="props">
      <input
        v-model="recipe.name"
        :readonly="!isEditing"
        placeholder="Recipe name"
        class="name">
      <textarea
        v-model="recipe.description"
        :readonly="!isEditing"
        placeholder="Description"
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
    position: relative;
  }

  /* TODO: show actions on hover only */
  .actions {
    position: absolute;
    right: 10px;
  }

  .recipe-card.editing > .image-container:hover {
    cursor: pointer;
  }

  .image-container {
    margin-right: 15px;
    flex: 1;
    position: relative;
  }

  .image-container .delete-image {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #fffc;
    padding: 5px;
  }

  .image-container.empty {
    position: relative;
  }

  .image-container.empty > .image-stub {
    border: 1px solid lightgray;
    color: gray;
    width: 250px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-container > img {
    width: 250px;
  }

  .image-container > input {
    visibility: hidden;
    width: 0;
    height: 0;
    position: absolute;
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
    /* leave space on the right for form action buttons */
    width: calc(100% - 135px);
  }

  textarea.description {
    margin-bottom: 10px;
    color: gray;
    width: calc(100% - 30px);
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
import IconButton from './shared/IconButton'

export default {
  name: 'RecipeCard',
  components: {
    Icon,
    IconButton
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
    },
    isDeletable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    onDelete (recipe) {
      this.$emit('delete', recipe)
    },
    onImageClick (e) {
      if (this.isEditing) {
        // activate file dialog
        this.$refs.imageInput.focus()
        this.$refs.imageInput.click()
      }
    },
    onImageChange (e) {
      const file = e.target.files[0]
      if (!file) {
        // file dialog canceled
        return
      }
      this.$emit('image-change', file)
    },
    onImageDelete (recipe) {
      this.$emit('image-delete', recipe)
    }
  }
}
</script>
