1. `vue-loader` styles scoping alters selectors specificity.  

    `vue-loader` appends attribute with element ID to each CSS selector in `style scoped` block,  
    eg. `span {...}` rule will be transformed to `span[data-v-1f37ba64] {...}`  
    First selector has tag specificity, second one - tag+class specificity.  

    While `CSS modules` does not alter specificity. It only transforms class names.  
    But it works with classes only, and does not allow to scope tag/id selectors.

    https://forum.vuejs.org/t/importance-hierarchy-specificity-of-styling-css-in-vue-file/26801/5

---

2. `vue` model observing system does not detect changes sometimes.  

    - eg. adding new properties to already observed object
    - or mutating array by index access
    (instead of observed methods push/slice/etc.)  

    Last case prevents using deep model updates (eg. with `extend` module).  
    Eg. when using external state container `vuex` you may want to decrease number of
    mutators to possible minimum (eg. one mutator for each major part of state)
    and send patches which overlay upon those parts, instead of creating separate
    mutator for each possible case. it allows to minimize/simplify mutators and
    increase flexibility for action logic.  
    But since deep array updates not detected, you either need deep-update utility
    which ignores arrays (shallow-replaces them), or create separate mutator for
    each entity with array inside.