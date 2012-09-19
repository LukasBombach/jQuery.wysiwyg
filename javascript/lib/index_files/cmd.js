(function( $ ){


  //console.log($.fn["editable"].prototype.Editor.prototype);

  $.fn["editable"].prototype.Editor.prototype.cmd = function( command, value, ui ) {
  
    // 1 Parameter String -> execCommand(cmd)
    // 2 Parameter String -> execCommand(cmd, val)
    // 3 Parameter String -> execCommand(cmd, val, ui)
    // { 'name': function, ...} -> neue commands hinzufügen

    //if( !this.hasFocus() )
    //  return this;

    command = command || '';
    value   = value   || null;
    ui      = ui      || false;
    
    window.document.execCommand(command, ui, value);

    return this;

  };
  

})( jQuery );