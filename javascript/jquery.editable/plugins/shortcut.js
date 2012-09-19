
(function( $ ){


  // Shortcuts avaialable by default for testing purposes
  var registered_shortcuts = {
    "B" : {
      "modifier": "strgcmd",
      "function": ["cmd", "bold"]
    },
    "I" : {
      "modifier": "strgcmd",
      "function": ["cmd", "italic"]
    },
    "S" : {
      "modifier": "strgcmd",
      "function": function() { console.log('saving'); }
    }
  };

  /**
   * Checks if a modifier key has been pressd
   * @param  e  event   The Keyevent
   * @param  m  String  The Modified that will be checked (if it s pressed or not)
   * @return bool Wether or not the modifier is pressed
   */
  function modifierPressed( e, m ) {
  
    // http://stackoverflow.com/questions/7217491/jquery-keydown-keyup-ignoring-i-b
    // http://jsfiddle.net/Hq43A/
  
    switch(m) {
    
      case 'strgcmd':
        if(e.ctrlKey || e.metaKey) {
          e.preventDefault();
          return true;
        }
    
    }
  
    return false;
  }

  
  $(window).bind('init.editable', function(e, ed) {
  
    var $el = $(e.target);

    $el.keydown(function(e) {
    
      var chr = String.fromCharCode(e.which);
  
      // If there is no shortcut registered for the currently pressed button OR
      // if there is a shortcut for that key, but the modifier key isn't pressd, return
      if( !registered_shortcuts[chr] || ( registered_shortcuts[chr]['modifier'] && !modifierPressed(e, registered_shortcuts[chr]['modifier']) ) )
        return;
      
      // If the function that is registered for a shortcut is an array, an internal function (plugin) should be called
      // The first element is the pluginname, all other elements are parameters.
      // i.e. ["cmd", "bold"] executes editor.cmd('bold')
      if( registered_shortcuts[chr]['function'] instanceof Array && ed[registered_shortcuts[chr]['function'][0]] !== undefined ) {
        ed[registered_shortcuts[chr]['function'][0]].apply( ed, Array.prototype.slice.call( registered_shortcuts[chr]['function'], 1 ));
        return false;
      }
        
      // If the function that is registered for a shortcut is a "real" function (typeof function), execute it
      if(typeof(registered_shortcuts[chr]['function']) == 'function')
        return registered_shortcuts[chr]['function']();  
  
    });
    
  });

})( jQuery );