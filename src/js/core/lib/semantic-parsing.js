import validateWrapper from "../../system/lib/validator.js";
import createResultObject from "../../system/lib/result-object.js";
import { RESULT_OBJECT_TYPE_ENUM } from "../../system/model/constants.js";
import { PACKAGE_TOKEN_VARIANT_NAME, METHOD_TOKEN_VARIANT_NAME, KEYWORD_PATTERN_NAME, FLAG_TOKEN_VARIANT_NAME, PROPERTY_PATTERN_NAME, FLAG_PATTERN_NAME, PROPERTY_VALUE_TOKEN_VARIANT_NAME, MESSAGE_PATTERN_NAME, PARSED_NODE_ACCUMULATOR_UPDATERS } from '../model/constants.js';

var parseInvocations = ( input ) => (
  input.value.reduce(
    (accumulator, current, currentIndex, array) => {
      if (accumulator.type === RESULT_OBJECT_TYPE_ENUM.ERROR || accumulator.value.skipNext) {
        delete accumulator.value.skipNext;

        return accumulator;
      }

      var parseHandler = TOKEN_PARSERS[current.type];

      if (!parseHandler) {
        return createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( `No such parse handler for token with type: ${current.type}` );
      }

      var parsedNode = parseHandler(
        {
          previous: array[currentIndex - 1] ?? null,
          current: current,
          next: array[currentIndex + 1] ?? null,
        }
      );

      if (parsedNode.type === RESULT_OBJECT_TYPE_ENUM.ERROR) {
        accumulator = parsedNode;

        return accumulator;
      }

      var updateAccumulator = PARSED_NODE_ACCUMULATOR_UPDATERS[parsedNode.value.type];

      if (!updateAccumulator) {
        return createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( `No such accumulator update handler for node with type: ${parsedNode.value.type}` );
      }

      accumulator.value = updateAccumulator(parsedNode.value, accumulator.value);

      if (parsedNode.value.skipNext) {
        accumulator.value.skipNext = parsedNode.value.skipNext;
      }

      return accumulator;
  }, createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( {
      package: "",
      method: "",
      arguments: [],
      flags: []
    } )
  )
);

var TOKEN_PARSERS = {
  [KEYWORD_PATTERN_NAME]: ( input ) => ( parseKeywordToken( input ) ),
  [PROPERTY_PATTERN_NAME]: ( input ) => ( parsePropertyToken( input ) ),
  [FLAG_PATTERN_NAME]: ( input ) => ( parseFlagToken( input ) ),
}

var parseFlagToken = ( input ) => (
  input.current.type === FLAG_PATTERN_NAME 
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( {
      type: FLAG_TOKEN_VARIANT_NAME,
      value: input.current.value,
    } )
  : createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( `Invalid flag token: ${input.current.value}` )
);

var parseKeywordToken = (input, currentVariant = PACKAGE_TOKEN_VARIANT_NAME) => (
  !currentVariant
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( `Unknown keyword token: ${input.current}` )
  : KEYWORD_TOKEN_VARIANTS[currentVariant]?.condition( input )
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( {
    type: currentVariant,
    keyword: input.current,
    } )
  : parseKeywordToken( input, KEYWORD_TOKEN_VARIANTS[currentVariant].next )
);

var KEYWORD_TOKEN_VARIANTS = {
  [PACKAGE_TOKEN_VARIANT_NAME]: {
    condition: ({ previous, current, next }) => (!previous && current?.type === KEYWORD_PATTERN_NAME && next?.type === KEYWORD_PATTERN_NAME),
    next: METHOD_TOKEN_VARIANT_NAME,
  },
  [METHOD_TOKEN_VARIANT_NAME]: {
    condition: ({ previous, current, next }) => (previous?.type === KEYWORD_PATTERN_NAME && current?.type === KEYWORD_PATTERN_NAME && next?.type !== KEYWORD_PATTERN_NAME),
    next: null,
  },
}

var parsePropertyToken = ( input ) => (
  input.current?.type !== PROPERTY_PATTERN_NAME
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.ERROR )( `Token is not a property: ${current.value}` )
  : input.next?.type === KEYWORD_PATTERN_NAME || input.next?.type === MESSAGE_PATTERN_NAME
  ? createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( {
      type: PROPERTY_VALUE_TOKEN_VARIANT_NAME,
      property: input.current.value,
      value: input.next?.value,
      skipNext: true,
    } )
  : createResultObject( RESULT_OBJECT_TYPE_ENUM.NORMAL )( {
    type: PROPERTY_VALUE_TOKEN_VARIANT_NAME,
    property: input.current.value,
    value: true,
    } )
);

export default (
  validateWrapper( ( input ) => ( input ) )
  ( parseInvocations )
);