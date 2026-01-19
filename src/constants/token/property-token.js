import { returnInvalid, returnValid } from "../../modules/validators.js";
import { KEYWORD_TOKEN_NAME, MESSAGE_TOKEN_NAME, PROPERTY_TOKEN_NAME } from "./token.js";

export var PROPERTY_VALUE_TOKEN_VARIANT_NAME = "property-value";

export var parsePropertyToken = (input) => {
  var { current, next } = input;

  if (current?.type !== PROPERTY_TOKEN_NAME) {
    return returnInvalid(`Token is not a property: ${current.value}`);
  }

  if (next?.type === KEYWORD_TOKEN_NAME || next?.type === MESSAGE_TOKEN_NAME) {
    return returnValid({
      type: PROPERTY_VALUE_TOKEN_VARIANT_NAME,
      property: current.value,
      value: next?.value,
      skipNext: true,
    });
  }

  return returnValid({
    type: PROPERTY_VALUE_TOKEN_VARIANT_NAME,
    property: current.value,
    value: true,
  });
}