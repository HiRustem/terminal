import { FLAG_PATTERN_NAME, INVALID_PATTERN_NAME, KEYWORD_PATTERN_NAME, MESSAGE_PATTERN_NAME, PROPERTY_PATTERN_NAME } from "../pattern.js";
import { parseFlagToken } from "./flag-token.js";
import { parseKeywordToken } from "./keyword-token.js";
import { parsePropertyToken } from "./property-token.js";

export var TOKEN_SUFFIX = "token";

export var KEYWORD_TOKEN_NAME = `${KEYWORD_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var FLAG_TOKEN_NAME = `${FLAG_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var PROPERTY_TOKEN_NAME = `${PROPERTY_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var MESSAGE_TOKEN_NAME = `${MESSAGE_PATTERN_NAME}-${TOKEN_SUFFIX}`;
export var INVALID_TOKEN_NAME = `${INVALID_PATTERN_NAME}-${TOKEN_SUFFIX}`;

export var TOKEN_PARSERS = {
  [KEYWORD_TOKEN_NAME]: (input) => (parseKeywordToken(input)),
  [PROPERTY_TOKEN_NAME]: (input) => (parsePropertyToken(input)),
  [FLAG_TOKEN_NAME]: (input) => (parseFlagToken(input)),
}
