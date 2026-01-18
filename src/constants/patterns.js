export var KEYWORD_PATTERN = /^[a-z]+$/;
export var MESSAGE_PATTERN = /^"[^"]*"$/;
export var PROPERTY_PATTERN = /^-[a-z]+$/;
export var FLAG_PATTERN = /^--[a-z]+$/;
export var QUOTE_SYMBOL_PATTERN = /["'`«»“”‘’]+/;
export var SPACE_BAR_PATTERN = /\s+/;

export var KEYWORD_PATTERN_NAME = "keyword";
export var FLAG_PATTERN_NAME = "flag";
export var PROPERTY_PATTERN_NAME = "property";
export var MESSAGE_PATTERN_NAME = "message";
export var INVALID_PATTERN_NAME = "invalid";

export var PATTERN_HANDLERS = {
  [KEYWORD_PATTERN_NAME]: {
    pattern: KEYWORD_PATTERN,
    next: FLAG_PATTERN_NAME,
  },
  [FLAG_PATTERN_NAME]: {
    pattern: FLAG_PATTERN,
    next: PROPERTY_PATTERN_NAME,
  },
  [PROPERTY_PATTERN_NAME]: {
    pattern: PROPERTY_PATTERN,
    next: MESSAGE_PATTERN_NAME,
  },
  [MESSAGE_PATTERN_NAME]: {
    pattern: MESSAGE_PATTERN,
    next: INVALID_PATTERN_NAME,
  },
  [INVALID_PATTERN_NAME]: null,
}

export var TOKENS_VALIDATORS_DEFAULT_KEY = "checkType";

export var KEYWORD_TOKEN_NAME = `${KEYWORD_PATTERN_NAME}-token`;
export var FLAG_TOKEN_NAME = `${FLAG_PATTERN_NAME}-token`;
export var PROPERTY_TOKEN_NAME = `${PROPERTY_PATTERN_NAME}-token`;
export var MESSAGE_TOKEN_NAME = `${MESSAGE_PATTERN_NAME}-token`;
export var INVALID_TOKEN_NAME = `${INVALID_PATTERN_NAME}-token`;

export var TOKENS_VALIDATORS = {
  [KEYWORD_TOKEN_NAME]: {
    [TOKENS_VALIDATORS_DEFAULT_KEY]: {
      validate: ({ value: { type, value } }) => type === KEYWORD_TOKEN_NAME ? undefined : `Invalid keyword type: ${value}`,
      next: null,
    },
  },
  [FLAG_TOKEN_NAME]: {
    [TOKENS_VALIDATORS_DEFAULT_KEY]: {
      validate: (token) => token.type === FLAG_TOKEN_NAME ? undefined : `Invalid flag type: ${value}`,
      next: null,
    },
  },
}