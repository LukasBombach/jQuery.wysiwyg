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

  /**
   * This function implements the API as a jQuery Plugin $('#el').editable
   * @param  mixed  method  The Method to call on jQuery.editable(  )
   * @return mixed  Either an array of Editor instanes or the chainable jQuery-Object, depending on the plugin's defaults and parameters
   */
  $.fn[pluginName] = function( method ) {

      var editors = [];

      this.each(function() {

        var editor = getEditorFromElementCreateIfNotExists(this);
        editors.push( editor );

        if( method && editor[method] )
          editor[method].apply( editor, Array.prototype.slice.call( arguments, 1 ) );

      })

      // return an array of editor-objects or the chainable jQuery object, depending on the defaults that are set
      return (defaults["return"]=="editor")? editors : this;
  };

  function getEditorFromElementCreateIfNotExists(el) {
    var editor = $.data(el, 'plugin_' + pluginName);
    if(!editor) {
      editor = new Editor( el );
      $.data(el, 'plugin_' + pluginName, editor);
    }
    return editor;
  }

  /**
   * Editor pseudo-class 
   */
  function Editor (el) {
    this.init(el);
  }

  /**
   * Make the Editor pseudo-class visible outside this function scope to allow plugins to extend it
   */
  $.fn[pluginName].prototype.Editor = Editor;

  /**
   * Constructor. 
   */
  Editor.prototype.init = function (el) {

    // Set variables
    this._defaults = defaults;
    this.setElement(el);

    // Make the DOM element editable
    this.$el.attr({
      'contentEditable' : 'true',
      'spellcheck'      : defaults.spellcheck
    });

    // Trigger Events
    this.$el.trigger( 'init.editable', this );

  };

  /**
   * Sets the element "this" editor refers to
   */
  Editor.prototype.setElement = function (el) {
    this.$el = $(el);
  };

  /**
   * Whether or not the editor's element is focussed
   * @return bool
   */
  Editor.prototype.hasFocus = function () {
    return this.$el.is(":focus");
  }

}(jQuery, window));