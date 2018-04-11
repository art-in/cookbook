1. `vue-loader` styles scoping alters selectors specificity.  

    `vue-loader` appends attribute with element ID to each CSS selector in `style scoped` block,  
    eg. `span {...}` rule will be transformed to `span[data-v-1f37ba64] {...}`  
    First selector has tag specificity, second one - tag+class specificity.  

    While `CSS modules` does not alter specificity. It only transforms class names.  
    But it works with classes only, and does not allow to scope tag/id selectors.

    https://forum.vuejs.org/t/importance-hierarchy-specificity-of-styling-css-in-vue-file/26801/5
