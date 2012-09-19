
(function( $ ){

  // ()                   <- get current selection     ✓
  // ("remove")           -> löscht die selection      ✓
  // ("deselect")         -> Was wohl                  ✓
  // (int, int)           -> set start, end            ✓
  // ({start:int/string}) -> set start                 ✓
  // ({end:int/string})   -> set end                   ✓
  // ({start, end})       -> set start end             ✓
  // ("start")            -> set start to 0            ✓
  // ("end")              -> set end to end            ✓
  // (*element)           -> select element in editor
  // ("bookmark")         -> return selection-positions as json-object   ✓
  // ("bookmark", obj)    -> set selection to json-object                ✓
  // Insert helper<script> for IE8

  var methods = {

    // Returns the markup inside the selection
    markup : function() { 
      return returnXML( window.getSelection().getRangeAt(0).cloneContents() );
    },

    // Returns the element that contains the selection
    element : function() {
      return window.getSelection().focusNode.parentElement;
    },

    // Removes the selected text
    remove : function() {
      window.getSelection().getRangeAt(0).deleteContents();
    },

    // Wraps the selection with the passed element
    // Sollte die gleiche API haben wie http://api.jquery.com/wrap/
    // Sollte das gewrappte element inkl. den Wrapper selektieren
    wrap : function( wrapWith ) {
    	window.getSelection().getRangeAt(0).surroundContents($(wrapWith)[0]);
    	window.getSelection().removeAllRanges();
    },

    // If no parameter is passed, bookmarks returns on object with that start- and end-offset of the current selection
    // If an object with the fields start and end is passed, a selection is made. This way you can save and load selections
    bookmark : function( obj ) {

      // if obj is passed "load" (select) the selection that is passed
      if(obj) {
        selectRange(this.$el[0].firstChild, obj.start, obj.end);
      }

      // If no obj is passed "save" the selection by returning an object that can be
      // passed to this function to load the selection again
      if(!obj){
        var range = window.getSelection().getRangeAt(0);
        return {"start":range.startOffset, "end":range.endOffset}
      }


    },

    // Makes a selection. Takes various arguments
    select : function(){

      var start, end;

      // A DOM-element or jQuery Object has been passed
      if(arguments[0].nodeType || arguments[0].jquery) {
        console.log('selecting Elements is not implemented yet');
      }

      // The string "start" has been passed
      if(arguments.length==1 && arguments[0]=="start") {
        selectRange(this.$el[0].firstChild, "start", null);
      }

      // The string "end" has been passed
      if(arguments.length==1 && arguments[0]=="end") {
        selectRange(this.$el[0].firstChild, null, "end");
      }

      // 2 parameters (2 ints) have been passed
      if(arguments.length==2) {
        selectRange(this.$el[0].firstChild, arguments[0], arguments[1]);
      }

      // An object { ["start":int] [, "end":int] } has been passed
      if(typeof arguments[0] === 'object') {
        start = arguments[0].start;
        end   = arguments[0].end;
        selectRange(this.$el[0].firstChild, start, end);
      }

    },

    // Guess what
    deselect : function() {
      window.getSelection().removeAllRanges();
    },

    // Removes the contents inside the selection
    delete : function() {
      window.getSelection().getRangeAt(0).deleteContents();
    }
  };

  
  // Sellects a range of element from offset start to end
  // start end end take the values int, null or "start"/"end" respectively
  function selectRange( el, start, end ) {
    var sel   = window.getSelection(),
        range = (window.getSelection().type!='None')? sel.getRangeAt(0) : document.createRange();

    if( start=="start" ) range.setStartBefore(el); 
    else if( start) range.setStart(el, start);
    
    if( end=="end" ) range.setEndAfter(el)
    else if( end ) range.setEnd(el, end);

    sel.removeAllRanges();
    sel.addRange(range);
  }


  // Helperfunction to return stuff
  function returnXML( fragment ) {
    var df = document.createElement('DocumentFragment');
    df.appendChild(fragment);
    return df.innerHTML;
  }


  // Argument-/Method-dispatcher for this plugin
  $.fn["editable"].prototype.Editor.prototype.selection = function( method ) {
  
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 )) || this;
    } else if ( !method ) {
      return methods.markup.apply( this, arguments );
    } else if(arguments.length==2 || typeof method === 'object' ) {
      return methods.select.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.edify.selection' );
    } 
  
  };


})( jQuery );