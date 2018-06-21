/* global module */
module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    // [same as for js]
    indentation: [2],
    'max-line-length': 80,
    'string-quotes': 'single',
    'declaration-empty-line-before': null,
    'block-no-empty': null,
    'no-duplicate-selectors': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export']
      }
    ],

    'no-eol-whitespace': [
      true,
      {
        ignore: ['empty-lines']
      }
    ]
  }
};
