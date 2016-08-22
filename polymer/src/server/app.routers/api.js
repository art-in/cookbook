const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const router = require('koa-router')();

router.prefix('/api');

const storage = require('../storage');

router

    .get('/recipes', async function () {
        const opts = this.query;

        const data = await storage.getRecipes(
            opts.skip ? parseInt(opts.skip, 10) : null,
            opts.limit ? parseInt(opts.limit, 10) : null,
            opts.sortProp || 'name',
            opts.sortDirection ? parseInt(opts.sortDirection, 10) : 1);

        this.body = JSON.stringify(data);
    })

    .post('/recipes', async function (next) {
        await storage.addRecipe(this.request.body);
        this.status = 200;
    })

    .put('/recipes/:id', async function (next) {
        await storage.updateRecipe(this.params.id, this.request.body);
        this.status = 200;
    })

    .del('/recipes/:id', async function (next) {
        await storage.deleteRecipe(this.params.id);
        this.status = 200;
    })

    .post('/recipes/:id/photo', async function (next) {
        if (this.request.finished) return this.request.end();

        const fileName = this.params.id;
        const width = this.query.width || 2 * 150;
        const height = this.query.height || 2 * 130;

        let resolve;
        let reject;
        const done = new Promise(function(res, rej) {
            resolve = res;
            reject = rej;
        });

        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../../client/images/recipes/');
        form.keepExtensions = true;

        form.once('file', onFileReceived.bind(this));
        form.on('error', onTransferError.bind(this));
        form.on('aborted', onTransferError.bind(this));

        /**
         * Handles file receiving
         * @param {string} name -
         * @param {File} file -
         */
        function onFileReceived(name, file) {
            console.log(`[FS] File received: ${fileName} [${file.path}]`);

            const extension = path.extname(file.path);
            const newPath = form.uploadDir + fileName;

            if (extension.search(/^\.(jpg|jpeg|png|gif)$/) === -1) {
                onProcessError(file.path, 
                    'Unsupported image format: ' + extension);
                return;
            }

            // Rename
            fs.rename(file.path, newPath);

            // TODO: add compression / resize

            console.log('Image resized: %s (%d x %d)', fileName, width, height);

            this.status = 200;
            resolve();
        }

        /**
         * Handles file transfer error
         * @param {object} err -
         */
        function onTransferError(err) {
            console.log('[FS] Filed upload error: ' + err);
            reject(err || 'Aborted');
        }

        /**
         * Handles file process error
         * @param {string} filePath -
         * @param {object} err -
         */
        function onProcessError(filePath, err) {
            fs.unlink(filePath, function() { });
            reject(err);
        }

        form.parse(this.request.req);

        await done;
    });

module.exports = router;
