import parseRawString from "./core/lib/parse-raw-string.js";
import lexicalAnalysis from "./core/lib/lexical-parsing.js";
import semanticAnalysis from "./core/lib/semantic-parsing.js";

import createResultObject from './system/lib/result-object.js';
import { RESULT_OBJECT_TYPE_ENUM } from './system/model/constants.js';

var inputElement = document.getElementById( "input" );

inputElement.addEventListener( "change", ( event ) => {
  var start = Date.now();

  var parsed = parseRawString( createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( event.target.value ) );

  var lexical = lexicalAnalysis( parsed );

  var semantic = semanticAnalysis( lexical );

  var end = Date.now();

  console.log( "parsed", parsed );
  console.log( "lexical", lexical );
  console.log( "semantic", semantic );
  console.log( "milliseconds:", end - start );
} );