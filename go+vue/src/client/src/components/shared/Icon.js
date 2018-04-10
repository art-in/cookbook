import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import {faTimes, faSpinner} from '@fortawesome/fontawesome-free-solid'

// register icons separately for three shaking
fontawesome.library.add(faTimes, faSpinner)

export default FontAwesomeIcon
