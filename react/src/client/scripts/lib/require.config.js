/** 
 * Main RequireJs config file.
 */

var require = {
    baseUrl: 'scripts',
    paths: {
        'jquery': 'lib/vendor/jquery-2.1.3',
        'co': 'lib/vendor/co',
        'react': 'lib/vendor/react',
        'JSXTransformer': 'lib/vendor/JSXTransformer',
        'jsx': 'lib/vendor/jsx',
        'text': 'lib/vendor/text',
        'Sortable': 'lib/vendor/Sortable',
        'react-sortable-mixin': 'lib/vendor/react-sortable-mixin'
    },
    jsx: {
        fileExtension: '.jsx'
    },
    shim: {
        'jquery': {
            exports: ['jQuery']
        }
    },
    'waitSeconds': 120
};
