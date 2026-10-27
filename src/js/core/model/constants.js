export var KEYWORD_REG_EXP = /^[a-z]+$/;
export var MESSAGE_REG_EXP = /^"[^"]*"$/;
export var PROPERTY_REG_EXP = /^-[a-z]+$/;
export var FLAG_REG_EXP = /^--[a-z]+$/;

export var KEYWORD_PATTERN_NAME = "KEYWORD";
export var FLAG_PATTERN_NAME = "FLAG";
export var PROPERTY_PATTERN_NAME = "PROPERTY";
export var MESSAGE_PATTERN_NAME = "MESSAGE";

export var INVALID_PATTERN_NAME = "INVALID";

export var PATTERN_HANDLERS = Object.freeze({
  [KEYWORD_PATTERN_NAME]: {
    pattern: KEYWORD_REG_EXP,
    next: FLAG_PATTERN_NAME,
  },
  [FLAG_PATTERN_NAME]: {
    pattern: FLAG_REG_EXP,
    next: PROPERTY_PATTERN_NAME,
  },
  [PROPERTY_PATTERN_NAME]: {
    pattern: PROPERTY_REG_EXP,
    next: MESSAGE_PATTERN_NAME,
  },
  [MESSAGE_PATTERN_NAME]: {
    pattern: MESSAGE_REG_EXP,
    next: INVALID_PATTERN_NAME,
  },
  [INVALID_PATTERN_NAME]: null,
});

export var PACKAGE_TOKEN_VARIANT_NAME = "package-name";
export var METHOD_TOKEN_VARIANT_NAME = "method-name";
export var PROPERTY_VALUE_TOKEN_VARIANT_NAME = "property-value";
export var FLAG_TOKEN_VARIANT_NAME = "flag-name";

export var PARSED_NODE_ACCUMULATOR_UPDATERS = {
  [PACKAGE_TOKEN_VARIANT_NAME]: ( current, accumulator ) => (
    {
      package: current.keyword,
      method: accumulator.method,
      arguments: accumulator.arguments,
      flags: accumulator.flags
    }
  ),
  [METHOD_TOKEN_VARIANT_NAME]: ( current, accumulator ) => (
    {
      package: accumulator.package,
      method: current.keyword,
      arguments: accumulator.arguments,
      flags: accumulator.flags
    }
  ),
  [PROPERTY_VALUE_TOKEN_VARIANT_NAME]: ( current, accumulator ) => {
    accumulator.arguments.push( current );

    return {
      package: accumulator.package,
      method: accumulator.method,
      arguments: accumulator.arguments,
      flags: accumulator.flags,
    }
  },
  [FLAG_TOKEN_VARIANT_NAME]: ( current, accumulator ) => {
    accumulator.flags.push( current );

    return {
      package: accumulator.package,
      method: accumulator.method,
      arguments: accumulator.arguments,
      flags: accumulator.flags,
    }
  },
}