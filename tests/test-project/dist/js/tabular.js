let _this = this;

/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

($ => {
    $.fn.tabularWidget = (options) => {
        let _options        = $.extend({
                selector: '.repeater'
            }, options),
            i,
            $form,
            repeaterOptions = $.extend({
                // (Optional)
                // start with an empty list of repeaters. Set your first (and only)
                // "data-repeater-item" with style="display:none;" and pass the
                // following configuration flag
                initEmpty             : false,
                // (Optional)
                // "defaultValues" sets the values of added items.  The keys of
                // defaultValues refer to the value of the input's name attribute.
                // If a default value is not specified for an input, then it will
                // have its value cleared.
                defaultValues         : {
                    'text-input': ''
                },
                // (Optional)
                // "show" is called just after an item is added.  The item is hidden
                // at this point.  If a show callback is not given the item will
                // have $(this).show() called on it.
                show                  : (a, b, c, d, e, f) => {
                    $(_this).slideDown();
                    let index   = $(_this).attr('tabular-index'),
                        options = _self.repeaterOptions[index];
                    _self.renameInputs(options, $(_this).find('input, textarea, select, checkbox'), options.$form.find('[data-repeater-item]').length - 1);
                },
                // (Optional)
                // "hide" is called when a user clicks on a data-repeater-delete
                // element.  The item is still visible.  "hide" is passed a function
                // as its first argument which will properly remove the item.
                // "hide" allows for a confirmation step, to send a delete request
                // to the server, etc.  If a hide callback is not given the item
                // will be deleted.
                hide                  : (deleteElement) => {
                    if (confirm('Are you sure you want to delete this element?')) {
                        $(_this).slideUp(deleteElement);
                    }

                    let index   = $(_this).attr('tabular-index'),
                        options = _self.repeaterOptions[index];

                    _self.dropValidation(_this, index, options);
                },
                // (Optional)
                // You can use this if you need to manually re-index the list
                // for example if you are using a drag and drop library to reorder
                // list items.
                ready                 : (setIndexes) => {
                    _this.$form.yiiActiveForm([], []);
                    _self.renameInputs(_this, undefined, 0);
                },
                // (Optional)
                // Removes the delete button from the first list item,
                // defaults to false.
                isFirstItemUndeletable: true
            }, _options.repeaterOptions);

        let findValidation = (options, attribute) => {
                options = options.origin;
                if (typeof options.clientValidation !== 'object') {
                    return;
                }

                for (let i in options.clientValidation) {
                    if (!options.clientValidation.hasOwnProperty(i) || typeof options.clientValidation[i] !== 'object') {
                        continue;
                    }

                    if (options.clientValidation[i].name === attribute) {
                        return options.clientValidation[i];
                    }
                }
            },
            findAttribute  = (attribute, $form) => {
                let data = $form.data('yiiActiveForm');

                if (typeof data === 'undefined') {
                    return false;
                }

                if (typeof data.attribute === 'undefined') {
                    return false;
                }

                for (let i in data.attributes) {
                    if (!data.attributes.hasOwnProperty(i)) {
                        continue;
                    }

                    if (data.aattributes[i].id === attribute) {
                        return true;
                    }
                }

                return false;
            };

        _this.renameInputs = (options, $elements, index) => {
            $elements = $elements || options.$form.find('input, textarea, select, checkbox');
            index     = index || 0;

            $elements.each(function () {
                let inputData = getAttrData(this, options);

                inputData.$this.attr({
                    name: inputData.inputName,
                    id  : inputData.id
                });

                if (inputData.$parent.hasClass(inputData._class)) {
                    inputData.$parent.removeClass(inputData._class).addClass(inputData.parentClass);
                }

                if (inputData.validation && !findAttribute(inputData.id, inputData.$form)) {
                    inputData.validation.id        = id;
                    inputData.validation.container = '.' + inputData.parentClass;
                    inputData.validation.input     = '#' + id;
                    options.$form.yiiActiveForm('add', inputData.validation);
                }
            });
        };

        let getAttrData = (elem, options) => {
            let $this        = $(this),
                name         = $this.attr('name'),
                originName   = $this.attr('data-origin-name'),
                repeaterName = $(options.$form).find('[data-repeater-list]').eq(0).data('repeater-list'),
                additional   = options.origin.additionalName ? options.origin.additionalName : '',
                inputName    = repeaterName + (additional.length ? '[' + additional + '][' : '[') + index.toString() + '][' + originName + ']',
                _class       = 'field-' + additional.toLocaleLowerCase() + '-' + originName.toLowerCase(),
                $parent      = $this.parent(),
                parentClass  = 'field-' + repeaterName.toLowerCase() + '-' + (additional.length ? additional.toLowerCase() + '-' : '') + index + '-' + originName.toLowerCase(),
                validation   = findValidation(options, originName),
                id           = parentClass.replace('field-', '');

            return {
                $this       : $this,
                $form       : options.$form,
                name        : name,
                originName  : originName,
                repeaterName: repeaterName,
                additional  : additional,
                inputName   : inputName,
                _class      : _class,
                $parent     : $parent,
                parentClass : parentClass,
                validation  : validation,
                id          : id
            };
        };

        _this.dropValidation = (element, index, options) => {
            $elements = $(element).$form.find('input, textarea, select, checkbox');
            index     = index || 0;

            $elements.each(function () {

                $this.attr({
                    name: inputName,
                    id  : id
                });

                if ($parent.hasClass(_class)) {
                    $parent.removeClass(_class).addClass(parentClass);
                }

                if (validation && !findAttribute(id, $form)) {
                    validation.id        = id;
                    validation.container = '.' + parentClass;
                    validation.input     = '#' + id;
                    options.$form.yiiActiveForm('add', validation);
                }
            });
        };

        _this.getOption = (name) => {
            return typeof _options[name] !== "undefined" ? _options[name] : null;
        };

        _this.setOption = (name, value) => {
            if (typeof name === "undefined") {
                return;
            }

            _options[name] = value;
        };

        _this.getRepeater = (ind) => {
            if (typeof _self.repeatersd[ind] === 'undefined') {
                return;
            }

            return _this.repeaters[ind];
        };

        _this.repeaters       = [];
        _this.repeaterOptions = [];
        _this.$forms          = $(_options.selector);

        let _self = _this;

        if (_this.$forms.length) {
            _this.$forms.each((index) => {
                $form = $(_this);

                $form.find('[data-repeater-item]').attr('tabular-index', index);

                repeaterOptions.$form  = $form;
                repeaterOptions.origin = options;
                repeaterOptions.index  = index;
                _self.repeaters.push($form.repeater(repeaterOptions));
                _self.repeaterOptions.push(repeaterOptions);
            });
        }

        return _this;
    };
})(jQuery);