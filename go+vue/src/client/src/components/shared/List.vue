<template>
  <div class="list">
    <span class="title">
      <slot name="title">
        <!-- title fallback -->
      </slot>
    </span>
    <icon-button
      v-if="isEditing"
      icon="plus-circle"
      @click="onItemAdd"
    />
    <ul :class="{ordered: isOrdered}">
      <li
        v-for="item in items"
        :key="item.id"
        class="item">
        <slot
          :item="item"
          name="item">
          <!-- item fallback -->
        </slot>
        <icon-button
          v-if="isEditing"
          icon="trash-alt"
          @click="onItemDelete(item)"
        />
      </li>
    </ul>
  </div>
</template>

<style>
  .list {
    /* initiate new block formatting context so child margins not slip out of
      list container */
    overflow: hidden;
  }

  .title {
    font-size: 1.3rem;
  }

  ul.ordered {
    list-style-type: decimal;
  }

  .item {
    line-height: 1.7em;
  }
</style>

<script>
import IconButton from './IconButton'

export default {
  name: 'List',
  components: {
    IconButton
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    isOrdered: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onItemAdd () {
      this.$emit('item-add')
    },
    onItemDelete (item) {
      this.$emit('item-delete', item)
    }
  }
}
</script>
