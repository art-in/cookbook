var http = require('http'),
    url = require("url"),
    qs = require('./lib/node_modules/qs'),
    config = require('./lib/config').config,
    helpers = require('./lib/server.helpers');

var business = require('./business/business');

/**
 * Server with request routing (static files + API).
 */
http.createServer(function (request, response) {
    console.log('==> ' + request.url);

    var requestPath = url.parse(request.url).pathname;
    var requestQuery = qs.parse(url.parse(request.url).query);

    try {
        Object.keys(requestQuery).forEach(function (paramName) {
            requestQuery[paramName] = JSON.parse(requestQuery[paramName]);
        });
    } catch (e) {
        helpers.respondWithError(response, requestPath, 'Invalid JSON in request parameters');
        return;
    }

    //region API

    if (/^\/api\//.test(requestPath)) {
        switch (requestPath) {
            case '/api/getRecipes':
                business.getRecipes(
                    requestQuery.opts,
                    helpers.respondWithJson.bind(null, response, requestPath)
                );
                break;

            case '/api/addRecipe':
                business.addRecipe(
                    requestQuery.newRecipe,
                    helpers.respondEmpty.bind(null, response, requestPath));
                break;

            case '/api/updateRecipe':
                business.updateRecipe(
                    requestQuery.recipeId,
                    requestQuery.properties,
                    helpers.respondEmpty.bind(null, response, requestPath));
                break;

            case '/api/deleteRecipe':
                business.deleteRecipe(
                    requestQuery.recipeId,
                    function (err) {
                        helpers.respondEmpty(response, requestPath, err);

                        if (!err) {
                            helpers.removeFile('presentation/images/recipes/' + requestQuery.recipeId);
                        }
                    });
                break;

            case '/api/uploadRecipePhoto':
                if (!requestQuery.recipeId) {
                    helpers.respondWithError(response, requestPath, 'Recipe ID should be specified');
                }

                if (request.method.toLowerCase() !== 'post') {
                    helpers.respondWithError(response, requestPath, 'POST method required');
                }

                helpers.handleFileUpload({
                    request: request,
                    response: response,
                    requestPath: requestPath,
                    uploadPath: 'presentation/images/recipes/',
                    targetName: requestQuery.recipeId
                });
                break;

            default:
                helpers.respondWithNotFound(response, requestPath);
        }
    } else

    //endregion

    //region Statics

    {
        if (requestPath === '/') requestPath += 'index.html';

        var respHeaders = {};
        var fileExtension = requestPath.split('.').pop();

        switch (fileExtension) {
            case 'html':
                respHeaders.mime = 'text/html';
                break;
            case 'ico':
                respHeaders.mime = 'image/x-icon';
                break;
            case 'css':
                respHeaders.mime = 'text/css';
                break;
            case 'js':
                respHeaders.mime = 'application/javascript';
                break;
            case 'png':
                respHeaders.mime = 'image/png';
                break;
            case 'appcache':
                respHeaders.mime = 'text/cache-manifest';
                respHeaders.maxAge = 0;
                break;
            default:
                respHeaders.mime = '';
        }

        helpers.respondWithFile(
            request,
            response,
                'presentation' + requestPath,
            respHeaders);
    }

    //endregion
}).listen(config.get('server:port'), config.get('server:ip'));