import { returnInvalid, validate } from "../../modules/validators.js";
import { FLAG_PATTERN_NAME, INVALID_PATTERN_NAME, KEYWORD_PATTERN_NAME, MESSAGE_PATTERN_NAME, PROPERTY_PATTERN_NAME } from "../pattern.js";
import { METHOD_TOKEN_VARIANT_NAME, PACKAGE_TOKEN_VARIANT_NAME, parseKeywordToken } from "./keyword-token.js";

export var TOKEN_SUFFIX = "token";

export var KEYWORD_TOKEN_NAME = `${KEYWORD_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var FLAG_TOKEN_NAME = `${FLAG_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var PROPERTY_TOKEN_NAME = `${PROPERTY_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var MESSAGE_TOKEN_NAME = `${MESSAGE_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var INVALID_TOKEN_NAME = `${INVALID_PATTERN_NAME}-${TOKEN_SUFFIX}`;

export var TOKEN_PARSERS = {
  [KEYWORD_TOKEN_NAME]: (input) => (parseKeywordToken(input)),
}

var validateTokens = (tokens) => (
  tokens.reduce(
    (accumulator, current, currentIndex, array) => {
      if (!accumulator.isValid) {
        return accumulator;
      }

      var parseHandler = TOKEN_PARSERS[current.valid.type];

      if (!parseHandler) {
        return returnInvalid(`No such parse handler for token with type: ${current.valid.type}`);
      }

      var parsedNode = parseHandler(
        {
          previous: array[currentIndex - 1]?.valid ?? null,
          current: current?.valid,
          next: array[currentIndex + 1]?.valid ?? null,
        }
      );

      if (!parsedNode.isValid) {
        accumulator = parsedNode;

        return accumulator;
      }

      // console.log('parsedNode', parsedNode);

      var updateAccumulator = PARSED_NODE_ACCUMULATOR_UPDATERS[parsedNode.valid.type];

      if (!updateAccumulator) {
        return returnInvalid(`No such accumulator update handler for node with type: ${parsedNode.valid.type}`)
      }

      accumulator.valid = updateAccumulator(parsedNode.valid, accumulator.valid);

      return accumulator;
  }, {
    isValid: true,
    valid: {
      package: "",
      method: "",
      arguments: [],
      flags: []
    }
  })
);

var PARSED_NODE_ACCUMULATOR_UPDATERS = {
  [PACKAGE_TOKEN_VARIANT_NAME]: (current, accumulator) => (
    {
      package: current.keyword,
      method: accumulator.method,
      arguments: accumulator.arguments,
      flags: accumulator.flags
    }
  ),
  [METHOD_TOKEN_VARIANT_NAME]: (current, accumulator) => (
    {
      package: accumulator.package,
      method: current.keyword,
      arguments: accumulator.arguments,
      flags: accumulator.flags
    }
  )
}

export default (input) => validate(
  ({ valid }) => validateTokens(valid),
)(
  input
);