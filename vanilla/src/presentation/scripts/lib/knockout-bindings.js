define(['ko', 'Sortable', 'lib/helpers'], function (ko, Sortable, helpers) {

    /**
     * Sets background color to the element 
     * depending on tag found in the source string.
     * 
     * Binding properties:
     * @param {string} source - source string observable
     * @param {Array} tags - array of tag definitions 
     *        (objects - {tag - regex string, color, default - (optional) bool});
     * @param {string} [defaultTag] - default tag if no tag found in source string.
     */
    ko.bindingHandlers.backgroundColorTag = {
        update: function(element, valueAccessor) {
            var value = valueAccessor();
    
            var source = value.source();
            var tagDefs = value.tags;
            
            // Check arguments.
            if (!source || !tagDefs || tagDefs.length < 1) {
                return;
            }
    
            // Find tag in source string and set background.
            var tagFound = tagDefs.filter(function(tagDef) {
                var regexp = new RegExp(tagDef.tag, 'gim');
                if (source.search(regexp) !== -1) {
                    $(element).css({'background-color': tagDef.color });
                    tagFound = true;
                    return true;
                }
            })[0];
    
            // Set default tag.
            if (!tagFound) {
                tagDefs.forEach(function(tagDef) {
                    if (tagDef.default) {
                        $(element).css({'background-color': tagDef.color });
                        return true;
                    }
                });
            }
        }
    };
    
    /**
     * Synchronizes observable with inner HTML of the element.
     * Usually used for contentEditables instead of default 'html'-binding,
     * because it syncs HTML changes immediately after each keyup.
     */
    ko.bindingHandlers.editableHTML = getEditableTextBinding(true);
    
    /**
     * Synchronizes observable with inner text of the element.
     * Usually used for contentEditables instead of default 'text'-binding,
     * because it syncs text changes immediately after each keyup.
     */
    ko.bindingHandlers.editableText = getEditableTextBinding();
    
    /** 
     * Returns binding that synchronizes observable with inner text or html of the element.
     * @param {boolean} [html=false] - leave untouched HTML or sanitize to text
     */
    function getEditableTextBinding(html) {
        return {
            init: function(element, valueAccessor) {
                
                var observable = valueAccessor();
                
                if (!ko.isObservable(observable)) 
                    throw new Error('Invalid target observable');
                    
                var $element = $(element);
                var initialValue = ko.utils.unwrapObservable(observable);
                
                html ? $element.html(initialValue) : $element.text(initialValue);
                $element.on('keyup', function() {
                    var observable = valueAccessor();
                    observable(html ? $element.html() : $element.text());
                });
            },
            update: function(element, valueAccessor) {
                var $element = $(element);
                
                var value = ko.unwrap(valueAccessor());
                
                var currentValue = html ? $element.html() : $element.text();
                if (currentValue !== value) {
                    html ? $element.html(value) : $element.text(value);
                }
            }
        };
    }
    
    /**
     * Sets value of contentEditable attribute of target element.
     */
    ko.bindingHandlers.contentEditable = {
        update: function(element, valueAccessor) {
            var isCE = ko.unwrap(valueAccessor());

            if (!!isCE) {
                element.setAttribute('contenteditable', '');
            } else {
                element.removeAttribute('contenteditable');
            }
        }
    };
    
    /**
     * Calls function when 'Return'-key pressed on target element.
     * 'Return + CTRL' adds new line.
     */
    ko.bindingHandlers.returnKeyPress = {
        init: function(element, valueAccessor) {
            $(element).on('keydown', function(e) {
                // 'Return'
                if (e.keyCode == 13 && !e.ctrlKey) {
                    valueAccessor();
                    e.preventDefault();
                }
    
                // 'Return + CTRL'
                if (e.keyCode == 13 && e.ctrlKey) {
                    document.execCommand('insertHTML', false, '<br><br>');
                    e.preventDefault();
                }
            });
        }
    };

    /**
     * Calls function when 'Escape'-key pressed on target element.
     */
    ko.bindingHandlers.escapeKeyPress = {
        init: function(element, valueAccessor) {
            $(element).on('keydown', function(e) {
                // 'Escape'
                if (e.keyCode === 27) {
                    valueAccessor();

                    window.getSelection().removeAllRanges();
                }
            });
        }
    };
    
    /**
     * Selects all contents of target element when observable turns true.
     */
    ko.bindingHandlers.contentSelect = {
        update: function(element, valueAccessor) {
            var select = ko.unwrap(valueAccessor());
            
            if (select) {
                var range = document.createRange();
                range.selectNodeContents(element);
                
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    };
    
    /**
     * Makes childs of target element - draggable.
     * 
     * Binding properties:
     * @param {string} draggableClass - CSS class of draggable elements
     * @param {string} handleClass - CSS class of handle element inside each draggable element
     * @param {string} ghostClass - CCS class element currently dragged
     * @param {function} onUpdate - function which is called after element released
     */
    ko.bindingHandlers.sortable = {
        init: function(element, valueAccessor) {
            var container = element;
            
            var params = valueAccessor();
            
            //noinspection JSUnusedGlobalSymbols
            new Sortable(container, {
                group: element.id,
                // Specifies which items inside the element should be sortable
                draggable: '.' + params.draggableClass,
                // Restricts sort start click/touch to the specified element
                handle: '.' + params.handleClass,
                ghostClass: params.ghostClass,
                onUpdate: function(e) {
                    if (params.onUpdate) {
                        var draggedElement = e.item;
                        //noinspection JSCheckFunctionSignatures
                        var newPosition = helpers.getChildNodeIndex(container, draggedElement, params.draggableClass);
                        
                        params.onUpdate(draggedElement, newPosition);
                    }
                }
            });
        }
    };
    
    /**
     * Synchronizes observable with bound view-model in selected option.
     */
    ko.bindingHandlers.selectedChildVM = {
        init: function(element, valueAccessor) {
            
            var observable = valueAccessor();
            
            if (!ko.isObservable(observable)) 
                throw new Error('Invalid target observable');
            
            $(element).change(function(e) {
                var targetOption = e.target.options[e.target.selectedIndex];
                var targetVM = ko.dataFor(targetOption);
                observable(targetVM);
            });
            
            if (observable() === undefined && element.options > 0) {
                // Set default option's view model
                element.selectedIndex = 0;
                $(element).trigger('change');
            }
        },
        update: function(element, valueAccessor) {
            var vm = valueAccessor()();
            
            if (!vm) return;
        
            var optionVMs = $(element).find('option').toArray().map(function(option) {
                return ko.dataFor(option);
            });
            var optionIndex = optionVMs.indexOf(vm);
            
            element.selectedIndex = optionIndex;
        }
    };

    /**
     * Synchronizes observable with number specified in element HTML.
     *
     * @param {number} editableNumberMin - min allowed number
     * @param {number} editableNumberMax - max allowed number
     *
     */
    ko.bindingHandlers.editableNumber = {
        init: function (element, valueAccessor, allBindings) {

            var observable = valueAccessor();

            if (!ko.isObservable(observable))
                throw new Error('Invalid target observable');

            var min = parseInt(allBindings.get('editableNumberMin')) || 0;
            var max = parseInt(allBindings.get('editableNumberMax')) || 10;

            var $element = $(element);
            var initialValue = ko.utils.unwrapObservable(observable);

            $element.text(parseNumber(initialValue, min, max));
            $element.on('keyup', function () {
                var observable = valueAccessor();

                var value = $element.text();
                var intValue = parseNumber(value, min, max);

                observable(intValue);

                if (value !== intValue.toString()) {
                    $element.text(value === '' ? '' : parseNumber(value, min, max));
                }
            });
        },
        update: function (element, valueAccessor, allBindings) {

            var min = allBindings.get('editableNumberMin') || 0;
            var max = allBindings.get('editableNumberMax') || 10;

            var $element = $(element);

            var value = ko.unwrap(valueAccessor());
            var currentValue = $element.text();

            if (value.toString() !== currentValue) {
                $element.text(value === '' ? '' : parseNumber(value, min, max));
            }
        }
    };

    function parseNumber(value, min, max) {
        min = min || 0;
        max = max || Number.POSITIVE_INFINITY;

        var number = value;

        if (typeof number === 'string') {
            number = parseInt(value) || min;
        }

        if (number < min) return min;
        if (number > max) return max;
        return number;
    }

    /** Selects element content on focus event */
    ko.bindingHandlers.focusSelectContent = {
        init: function (element) {

            $(element).on('focus', function () {
                var range = document.createRange();
                range.selectNodeContents(element);

                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            });
        }
    };
});
