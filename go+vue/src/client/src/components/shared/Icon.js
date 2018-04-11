import Vue from 'vue'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

// import icons separately for three shaking
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import faSave from '@fortawesome/fontawesome-free-solid/faSave'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle'

import faSmile from '@fortawesome/fontawesome-free-regular/faSmile'
import faClock from '@fortawesome/fontawesome-free-regular/faClock'

fontawesome.library.add(
  faTimes,
  faSpinner,
  faPencilAlt,
  faTrashAlt,
  faSave,
  faEraser,
  faPlusCircle,

  faSmile,
  faClock
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

// TODO: remove wrapper when FontAwesomeIcon fixes title prop
// https://github.com/FortAwesome/vue-fontawesome/issues/63
export default Vue.component('icon', {
  props: {
    icon: {
      type: [Array, String],
      required: true
    },
    size: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: false,
      default: undefined
    },
    spin: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick () {
      this.$emit('click')
    }
  },
  template: `
    <span :title="title" @click="onClick">
      <font-awesome-icon :icon="icon" :size="size" :spin="spin" />
    </span>
  `
})
