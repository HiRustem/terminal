import { returnInvalid, returnValid } from "../../modules/validators.js";
import { KEYWORD_TOKEN_NAME } from "./token.js";

export var PACKAGE_TOKEN_VARIANT_NAME = "package-name";
export var METHOD_TOKEN_VARIANT_NAME = "method-name";

var KEYWORD_TOKEN_VARIANTS = {
  [PACKAGE_TOKEN_VARIANT_NAME]: {
    condition: ({ previous, current, next }) => (!previous && current?.type === KEYWORD_TOKEN_NAME && next?.type === KEYWORD_TOKEN_NAME),
    next: METHOD_TOKEN_VARIANT_NAME,
  },
  [METHOD_TOKEN_VARIANT_NAME]: {
    condition: ({ previous, current, next }) => (previous?.type === KEYWORD_TOKEN_NAME && current?.type === KEYWORD_TOKEN_NAME && next?.type !== KEYWORD_TOKEN_NAME),
    next: null,
  },
}

export var parseKeywordToken = (input, currentVariant = PACKAGE_TOKEN_VARIANT_NAME) => {
  if (!currentVariant) return returnInvalid(`Unknown keyword token: ${input.current.value}`);

  if (KEYWORD_TOKEN_VARIANTS[currentVariant].condition(input)) {
    return returnValid(
      {
        type: currentVariant,
        keyword: input.current.value,
      }
    )
  }

  return parseKeywordToken(input, KEYWORD_TOKEN_VARIANTS[currentVariant].next);
}