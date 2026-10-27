import validateWrapper from "../../system/lib/validator.js";
import createResultObject from "../../system/lib/result-object.js";
import { RESULT_OBJECT_TYPE_ENUM } from "../../system/model/constants.js";

var SPACE_BAR_REG_EXP = /\s+/;
var QUOTE_SYMBOL_REG_EXP = /["'`«»“”‘’]+/;

var parseRawString = ( input ) => {
  if ( !input.value.length ) return createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( "Empty string!" );

  var substrings = [];
  var currentSubstring = "";
  var ignoreSpaceBar = false;

  for ( var i = 0; i < input.value.length; i++ ) {
    var currentLetter = input.value[i];

    if ( !ignoreSpaceBar && currentLetter.match( SPACE_BAR_REG_EXP ) ) {
      substrings.push(currentSubstring);
      currentSubstring = "";
      continue;
    }

    if ( currentLetter.match( QUOTE_SYMBOL_REG_EXP ) ) {
      ignoreSpaceBar = !ignoreSpaceBar;
    }

    currentSubstring += currentLetter;

    if ( i === input.value.length - 1 && !!currentSubstring.length ) {
      substrings.push(currentSubstring);
    }
  }

  return ignoreSpaceBar
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( "Invalid character set. Missing closing quotes" )
  : createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( substrings );
}

export default (
  validateWrapper( ( input ) => ( input ) )
  ( parseRawString )
);