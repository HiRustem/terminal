export var KEYWORD_PATTERN = /^[a-z]+$/;
export var MESSAGE_PATTERN = /^"[^"]*"$/;
export var PROPERTY_PATTERN = /^-[a-z]+$/;
export var FLAG_PATTERN = /^--[a-z]+$/;
export var QUOTE_SYMBOL_PATTERN = /["'`«»“”‘’]+/;
export var SPACE_BAR_PATTERN = /\s+/;

export var patternHandlers = {
  "keyword": {
    pattern: KEYWORD_PATTERN,
    next: "flag",
  },
  "flag": {
    pattern: FLAG_PATTERN,
    next: "property",
  },
  "property": {
    pattern: PROPERTY_PATTERN,
    next: "message",
  },
  "message": {
    pattern: MESSAGE_PATTERN,
    next: "invalid",
  },
  "invalid": null,
}