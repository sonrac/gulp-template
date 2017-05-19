/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

jQuery(document).ready(function () {
    $('.repeater').tabularWidget({
        selector        : ".repeater",
        additionalName  : 'articleTranslates',
        clientValidation: [{
            "id"       : "articletranslates-title",
            "name"     : "title",
            "container": ".field-articletranslates-title",
            "input"    : "#articletranslates-title",
            "validate" : function (attribute, value, messages, deferred, $form) {
                yii.validation.required(value, messages, {"message": "Title cannot be blank."});
                yii.validation.string(value, messages, {
                    "message"    : "Title must be a string.",
                    "max"        : 255,
                    "tooLong"    : "Title should contain at most 255 characters.",
                    "skipOnEmpty": 1
                });
            }
        }, {
            "id"       : "articletranslates-article_id",
            "name"     : "article_id",
            "container": ".field-articletranslates-article_id",
            "input"    : "#articletranslates-article_id",
            "validate" : function (attribute, value, messages, deferred, $form) {
                yii.validation.number(value, messages, {
                    "pattern"    : /^\s*[+-]?\d+\s*$/,
                    "message"    : "Article Id must be an integer.",
                    "skipOnEmpty": 1
                });
            }
        }, {
            "id"       : "articletranslates-body",
            "name"     : "body",
            "container": ".field-articletranslates-body",
            "input"    : "#articletranslates-body",
            "validate" : function (attribute, value, messages, deferred, $form) {
                yii.validation.required(value, messages, {"message": "Body cannot be blank."});
                yii.validation.string(value, messages, {"message": "Body must be a string.", "skipOnEmpty": 1});
            }
        }, {
            "id"       : "articletranslates-slug",
            "name"     : "slug",
            "container": ".field-articletranslates-slug",
            "input"    : "#articletranslates-slug",
            "validate" : function (attribute, value, messages, deferred, $form) {
                yii.validation.required(value, messages, {"message": "Slug cannot be blank."});
                yii.validation.string(value, messages, {
                    "message"    : "Slug must be a string.",
                    "max"        : 1500,
                    "tooLong"    : "Slug should contain at most 1,500 characters.",
                    "skipOnEmpty": 1
                });
            }
        }, {
            "id"       : "articletranslates-language",
            "name"     : "language",
            "container": ".field-articletranslates-language",
            "input"    : "#articletranslates-language",
            "validate" : function (attribute, value, messages, deferred, $form) {
                yii.validation.required(value, messages, {"message": "Language cannot be blank."});
                yii.validation.string(value, messages, {
                    "message"    : "Language must be a string.",
                    "max"        : 50,
                    "tooLong"    : "Language should contain at most 50 characters.",
                    "skipOnEmpty": 1
                });
            }
        }]
    });
});