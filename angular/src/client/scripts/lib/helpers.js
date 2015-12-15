define(['jquery'], function($) {
    return function() {
        
        /**
         * Returns index of child node inside container.
         *
         * @param {HTMLElement} container
         * @param {HTMLElement} childNode
         * @param {string} [childCssClass] - only take childs with this CSS class into account
         */
        function getChildNodeIndex (container, childNode, childCssClass) {
            return Array.prototype.indexOf.call(
                Array.prototype.slice.call(container.childNodes)
                    .filter(
                    function (node) {
                        if (!childCssClass) return true;
                        
                        if (node.classList) {
                            return node.classList.contains(childCssClass);
                        }
                        return false;
                    }), childNode);
        }
    
        /**
         * Moves Array element to new position.
         *
         * @param {number} old_index
         * @param {number} new_index
         */
        function arrayMoveItem (old_index, new_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this; // for testing purposes
        }
    
        function guid () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        function uid () {
            return guid().split('-').shift();
        }
        
        /** 
         * Promisified ajax request
         * @return {Promise}
         */
        function request(url, opts) {
            var resolve, reject;
            var promise = new Promise(function(res, rej) {
                resolve = res;
                reject = rej;
            });
            
            opts.success = resolve;
            opts.error = function(jqXHR, textStatus, errorThrown) {
                reject(new Error(errorThrown));
            };
            
            $.ajax(url, opts);
            
            return promise;
        }
        
        function removeFromArray(arr, item) {
            arr.splice(arr.indexOf(item), 1);
        }
        
        return {
            getChildNodeIndex: getChildNodeIndex,
            arrayMoveItem: arrayMoveItem,
            guid: guid,
            uid: uid,
            request: request,
            removeFromArray: removeFromArray
        };
    };
});