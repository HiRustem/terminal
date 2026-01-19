import { METHOD_TOKEN_VARIANT_NAME, PACKAGE_TOKEN_VARIANT_NAME } from "../constants/token/keyword-token.js";
import { PROPERTY_VALUE_TOKEN_VARIANT_NAME } from "../constants/token/property-token.js";
import { PROPERTY_TOKEN_NAME, TOKEN_PARSERS } from "../constants/token/token.js";
import { returnInvalid, validate } from "./validators.js"

var parseInvocations = (tokens) => (
  tokens.reduce(
    (accumulator, current, currentIndex, array) => {
      if (!accumulator.isValid || accumulator.skipNext) {
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

      if (parsedNode.skipNext) {
        accumulator.skipNext = parsedNode.skipNext;

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
  ),
  [PROPERTY_VALUE_TOKEN_VARIANT_NAME]: (current, accumulator) => {
    accumulator.arguments.push(current);

    return {
      package: accumulator.package,
      method: accumulator.method,
      arguments: accumulator.arguments,
      flags: accumulator.flags,
    }
  },
}

export default (input) => validate(
  ({ valid }) => parseInvocations(valid),
)(
  input
);