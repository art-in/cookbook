var path = require('path');
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var lwip = require('lwip');

var business = require('../business');

router.get('/recipes', function(req, res, next) {
  business.getRecipes(req.query.opts, function(err, data) {
      if (err) return next(err);
      res.end(JSON.stringify(data));
  });
});

router.post('/recipes', function(req, res, next) {
    business.addRecipe(req.body.newRecipe, function(err, data) {
        if (err) return next(err);
        res.end();
    });
});

router.put('/recipes/:id', function(req, res, next) {
    business.updateRecipe(req.params.id, req.body.properties, 
        function(err) {
            if (err) return next(err);
            res.end();
        });
});

router.delete('/recipes/:id', function(req, res, next) {
    business.deleteRecipe(req.params.id, function(err) {
        if (err) return next(err);
        res.end();
    });
});

router.post('/recipes/:id/photo', function(req, res, next) {
     if (res.finished) return res.end();
    
    var fileName = req.params.id;
    var width = req.query.width || 2 * 150;
    var height = req.query.height || 2 * 130;

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../client/images/recipes/');
    form.keepExtensions = true;

    form.once('file', onFileReceived);
    form.on('error', onTransferError);
    form.on('aborted', onTransferError);
    
    function onFileReceived(name, file) {
        console.log('[FS] File received: ' + fileName + ' [' +  file.path + ']');
                
        var extension = path.extname(file.path);
        var newPath = form.uploadDir + fileName;
        
        if (extension.search(/^\.(jpg|jpeg|png|gif)$/) === -1) {
            return onProcessError(file.path, 'Unsupported image format: ' + extension);
        }
        
        // Resize
        lwip.open(file.path, function(err, image) {
            if(err) return onProcessError(file.path, err);
            
            image.batch()
                .cover(width, height)
                .writeFile(file.path, function(err) {
                    if (err) return onProcessError(file.path, err);
                    
                    // Rename
                    fs.rename(file.path, newPath);
                    
                    console.log('Image resized: %s (%d x %d)', fileName, width, height);
                    res.end();
                });
        });
    }
    
    function onTransferError(err) {
        console.log('[FS] Filed upload error: ' + err);
        next(err || 'Aborted');
    }
    
    function onProcessError(filePath, err) {
        fs.unlink(filePath, function() {});
        next(err);
    }
    
    form.parse(req);
});

module.exports = router;
