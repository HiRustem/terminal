import validateWrapper from "../../system/lib/validator.js";
import createResultObject from "../../system/lib/result-object.js";
import { RESULT_OBJECT_TYPE_ENUM } from "../../system/model/constants.js";
import { KEYWORD_PATTERN_NAME, PATTERN_HANDLERS, INVALID_PATTERN_NAME } from "../model/constants.js";

var getLexicalTokens = ( input ) => (
  input.value.reduce(
    (accumulator, current) => {
      if (accumulator.type === RESULT_OBJECT_TYPE_ENUM.ERROR || accumulator.type === RESULT_OBJECT_TYPE_ENUM.RETURN) {
        return accumulator;
      }

      var currentToken = getToken()( current );

      return currentToken.type === RESULT_OBJECT_TYPE_ENUM.ERROR
      ? currentToken
      : (
        accumulator.value.push( currentToken.value ),
        accumulator
      );
    }, createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( [] )
  )
);

var getToken = ( patternToCheck = KEYWORD_PATTERN_NAME ) => ( input ) => (
  patternToCheck === INVALID_PATTERN_NAME
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( `Invalid pattern: ${input === "" ? "extra space" : input}` )
  : input.match( PATTERN_HANDLERS[patternToCheck].pattern )
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( {
      type: patternToCheck,
      value: input,
    } )
  : getToken( PATTERN_HANDLERS[patternToCheck].next )( input )
)

export default (
  validateWrapper( ( input ) => ( input ) )
  ( getLexicalTokens )
);