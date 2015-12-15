/** 
 * Main RequireJs config file.
 */

var require = {
    baseUrl: 'scripts',
    paths: {
        'jquery': 'lib/vendor/jquery-2.1.3',
        'co': 'lib/vendor/co',
        'Sortable': 'lib/vendor/Sortable',
        'angular': 'lib/vendor/angular'
    },
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'angular': {
            exports: 'angular'
        }
    },
    'waitSeconds': 120
};
