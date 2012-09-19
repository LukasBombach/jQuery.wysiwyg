/*
 *  Project:        jQuery Editable PLugin
 *  Description: 
 *  Author:         Lukas Bombach
 *  License:        MIT
 */

;(function ( $, window, undefined ) {
    
    // Plugin defaults
    var pluginName = 'editable',
        document   = window.document,
        defaults   = {
            "return"     : "editor",
            "spellcheck" : false
        };

    $.fn[pluginName] = function( method ) {

        var editors = [];

        this.each(function() {

            var editor;

            if ( !(editor = $.data(this, 'plugin_' + pluginName)) ) {
                editor = new Editor( this );
                $.data(this, 'plugin_' + pluginName, editor);
            }

            editors.push( editor );

            // hingerotzt um einfach zu sehen ob das tut, nochmal drüber nachdenken
            if( method ) editor[method].apply( editor, Array.prototype.slice.call( arguments, 1 ) );

        })

        return (defaults["return"]=="editor")? editors : this;
    };

    // Plugin constructor
    function Editor(method) {

        // Noch nicht optimal. Bedeutet Element setzen geht immer mit element
        // als ersten parameter, zu jeder Zeit, keine ganz saubere API
        if(method.nodeType || method.jquery)
            this.$el = $( Array.prototype.shift.call(arguments, 1) );

        method = arguments[0];

        // Method dispatching
        if ( this[method] ) {
            return this[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return this.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.'+pluginName );
        }

    }

    Editor.prototype.init = function () {
        this._defaults = defaults;

        this.$el.attr({
          'contentEditable' : 'true',
          'spellcheck'      : defaults.spellcheck
        });

        this.$el.trigger( 'init.editable', this );

    };

    Editor.prototype.hasFocus = function () {
        return this.$el.is(":focus");
    }

    /*
    Editor.prototype.setElement = function (el) {
        this.$el = $(el);
    };

    Editor.prototype.extend = function (obj) {
        jQuery.extend( true, Editor.prototype, obj );

    };
    */


    // Make the editor visible outside this function scope to make it acessible for editor-plugins
    $.fn[pluginName].prototype.Editor = Editor;

}(jQuery, window));