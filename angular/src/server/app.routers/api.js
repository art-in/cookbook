var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var router = require('koa-router')();
var Promise = require('bluebird').Promise;


router.prefix('/api');

var storage = require('../storage');

// TODO: assert request params

router

    .get('/recipes', function* (next) {
        var opts = this.query;
        
        var data = yield storage.getRecipes(
            !opts.skip ? 0 : parseInt(opts.skip, 10), 
            !opts.limit ? Number.POSITIVE_INFINITY : parseInt(opts.limit, 10),
            opts.sortProp || 'name', 
            !opts.sortDirection ? 1 : parseInt(opts.sortDirection, 10));
        
        this.body = JSON.stringify(data);
    })
    
    .post('/recipes', function* (next) {
        yield storage.addRecipe(this.request.body.newRecipe);
        this.status = 200;
    })
    
    .get('/recipes/:id', function* (next) {
        var recipe = yield storage.getRecipe(this.params.id);
        this.body = JSON.stringify(recipe);
    })
    
    .put('/recipes/:id', function* (next) {
        yield storage.updateRecipe(this.params.id, this.request.body.properties);
        this.status = 200;
    })
    
    .del('/recipes/:id', function* (next) {
        yield storage.deleteRecipe(this.params.id);
        this.status = 200;
    })
    
    .post('/recipes/:id/photo', function* (next) {
        if (this.request.finished) return this.request.end();
        
        var fileName = this.params.id;
        var width = this.query.width || 2 * 150;
        var height = this.query.height || 2 * 130;
        
        var resolve;
        var reject;
        var done = new Promise(function(res, rej) {
            resolve = res;
            reject = rej;
        });
        
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../../client/images/recipes/');
        form.keepExtensions = true;
    
        form.once('file', onFileReceived.bind(this));
        form.on('error', onTransferError.bind(this));
        form.on('aborted', onTransferError.bind(this));
        
        function onFileReceived(name, file) {
            console.log('[FS] File received: ' + fileName + ' [' +  file.path + ']');
                    
            var extension = path.extname(file.path);
            var newPath = form.uploadDir + fileName;
            
            if (extension.search(/^\.(jpg|jpeg|png|gif)$/) === -1) {
                return onProcessError(file.path, 'Unsupported image format: ' + extension);
            }
            
            // Rename
            fs.rename(file.path, newPath);
            
            // TODO: add compression / resize
            
            console.log('Image resized: %s (%d x %d)', fileName, width, height);
            
            this.status = 200;
            resolve();
        }
        
        function onTransferError(err) {
            console.log('[FS] Filed upload error: ' + err);
            reject(err || 'Aborted');
        }
        
        function onProcessError(filePath, err) {
            fs.unlink(filePath, function() {});
            reject(err);
        }
        
        form.parse(this.request.req);
        
        yield done;
    });

module.exports = router;
