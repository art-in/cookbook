var path = require('path'),
    fs = require('fs'),
    zlib = require('zlib'),
    formidable = require('../lib/node_modules/formidable');

/**
 * Writes compressed file contents to response stream.
 * Takes client cache into account (can send '304 - Not Modified').
 * 
 * @param {ClientRequest} request
 * @param {ServerResponse} response
 * @param {string} filePath - path relative to 'src' folder
 * @param {Object} [headers]
 * @param {string} [headers.mime]
 * @param {number} [headers.maxAge] - seconds to live in client cache
 */
function respondWithFile (request, response, filePath, headers) {
    if (response.finished) return;

    headers === undefined && (headers = {});
    
    var fullPath = path.join(__dirname, '../' + filePath);

    fs.readFile(fullPath,
        function (err, data) {
            if (err) {
                respondWithNotFound(response, filePath);
                return;
            }

            fs.stat(fullPath, function (err, stats) {
                if (err) { throw err; }
                
                // Check if file was modified since last time browser loaded it.
                var modifiedDate = stats.mtime.toUTCString();
                var modifiedRequestDate = new Date(request.headers['if-modified-since']).toUTCString();

                if (modifiedDate == modifiedRequestDate) {
                    response.writeHead(304, {
                        'Last-Modified': modifiedDate
                    });
                    response.end(); // Take it from cache.
                }
                else {
                    // Set headers
                    if (headers.maxAge !== undefined) {
                        response.setHeader('Cache-Control', 'max-age=' + headers.maxAge);
                    }
                    
                    if (headers.mime !== undefined) {
                        response.setHeader('Content-Type', headers.mime);
                    }
                    
                    response.writeHead(200,
                        {
                            'Content-Encoding': 'gzip',
                            'Last-Modified': modifiedDate
                        });
                    
                    // Compress
                    zlib.gzip(data, function (_, result) {
                        response.end(result);
                    });
                }

                console.log('<-- ' + filePath + ' [' + response.statusCode + ']');
            });
        }
    );
}

/**
 * Writes compressed JSONified data to response stream.
 *
 * @param {Object} response
 * @param {string} apiPath - requested API method
 * @param {string|boolean} error
 * @param {Object[]} data
 */
function respondWithJson (response, apiPath, error, data) {
    if (response.finished) return;

    if (error) {
        respondWithError(response, apiPath, error);
        return;
    }

    response.writeHead(200,
        {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
            'Cache-Control': 'no-cache'
        });

    var responseString = JSON.stringify(data);

    zlib.gzip(responseString, function (_, result) {
        response.end(result);

        console.log('<-- ' + apiPath + ' [' + response.statusCode + ']');
    });
}

function respondWithError (response, requestPath, error) {
    if (response.finished) return;

    response.writeHead(500);
    response.end(error);
    console.log('<-X ' + requestPath + ' [' + response.statusCode + ']');
}

function respondWithNotFound(response, requestPath) {
    if (response.finished) return;

    response.writeHead(404);
    response.end("Not found.");
    console.log('<-X File not found: ' + requestPath);
}

/**
 * Ends response with no data.
 *
 * @param response
 * @param apiPath
 * @param error
 */
function respondEmpty (response, apiPath, error) {
    if (response.finished) return;

    if (error) {
        respondWithError(response, apiPath, error);
    } else {
        response.writeHead(200);
        response.end();
    }

    console.log('<-- ' + apiPath + ' [' + response.statusCode + ']');
}

/**
 * Handles multipart/form-data request as file upload.
 *
 * @param {Object} opts
 * @param opts.request
 * @param opts.response
 * @param opts.requestPath
 * @param opts.uploadPath - upload directory
 * @param [opts.targetName] - file's new name (extension preserved)
 * @param {boolean} [opts.keepExtension=false]
 * @param {function} [cb] - called when file received, file path passed
 */
function handleFileUpload(opts, cb) {
    if (opts.response.finished) return;

    var uploadPath = path.join(__dirname, '../' + opts.uploadPath);

    var form = new formidable.IncomingForm();
    form.uploadDir = uploadPath;
    form.keepExtensions = opts.keepExtension;

    // File received
    form.on('file', function(name, file) {
        console.log('File received: ' + opts.targetName + ' [' + file.path + ']');

        var filePath = file.path;
        if (opts.targetName) {
            // Rename file
            var extension = opts.keepExtension && file.name.indexOf('.') !== -1 ? '.' + file.name.split('.').pop() : '';
            var newPath = uploadPath + opts.targetName + extension;
            fs.rename(file.path, newPath);
            filePath = newPath;
        }

        cb && cb(filePath);
    });

    // Upload failed
    form.on('error', function (err) {
        respondWithError(opts.response, opts.requestPath, err);
    });

    // Upload aborted
    form.on('aborted', function() {
        console.log('Request aborted');
        respondWithError(opts.response, opts.requestPath, 'ABORTED');
    });

    // All files received
    form.on('end', function () {
        respondEmpty(opts.response, opts.requestPath);
    });

    form.parse(opts.request);
}

function removeFile(filePath) {
    filePath = path.join(__dirname, '../' + filePath);

    fs.exists(filePath, function (exists) {
        if (!exists) return;

        fs.unlink(filePath, function (err) {
            if (err) console.log(err);
            else console.log('[FS] File removed: ' + filePath);
        });
    })
}

module.exports = {
    respondWithFile: respondWithFile,
    respondWithJson: respondWithJson,
    respondWithError: respondWithError,
    respondWithNotFound: respondWithNotFound,
    respondEmpty: respondEmpty,
    handleFileUpload: handleFileUpload,
    removeFile: removeFile
};