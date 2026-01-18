import { patternHandlers, QUOTE_SYMBOL_PATTERN, SPACE_BAR_PATTERN } from "../constants/patterns.js";
import { validate, returnInvalid, returnValid } from "./validators.js";

var quotesErrorString = "Invalid character set. Сlosing quotes not found";

var tokenize = (input) => {
  var substrings = [];
  var currentSubstring = "";
  var ignoreSpaceBar = false;

  for (var i = 0; i < input.length; i++) {
    var currentLetter = input[i];

    if (!ignoreSpaceBar && currentLetter.match(SPACE_BAR_PATTERN)) {
      substrings.push(currentSubstring);
      currentSubstring = "";
      continue;
    }

    if (currentLetter.match(QUOTE_SYMBOL_PATTERN)) {
      ignoreSpaceBar = !ignoreSpaceBar;
    }

    currentSubstring += currentLetter;

    if (i === input.length - 1 && !!currentSubstring) {
      substrings.push(currentSubstring);
    }
  }

  if (ignoreSpaceBar) return returnInvalid(quotesErrorString);

  return returnValid(substrings);
}

var getLexicalTokens = (substrings) => {
  return substrings.reduce((accumulator, current) => {
    if (!accumulator.isValid) {
      return accumulator;
    }

    var currentToken = getToken(current);

    if (!currentToken.isValid) {
      accumulator.isValid = false;
    }

    accumulator.value.push(currentToken);

    return accumulator;
  }, { isValid: true, value: [] });
};

var getToken = (input, patternToCheck = "keyword") => {
  if (patternToCheck === "invalid") {
    return returnInvalid(`Not valid pattern: ${input}`);
  }

  if (input.match(patternHandlers[patternToCheck].pattern)) {
    return returnValid({
      type: `${patternToCheck}-token`,
      value: input,
    });
  }

  return getToken(input, patternHandlers[patternToCheck].next);
}

export default (input) => validate(
  (valid) => (getLexicalTokens(valid.value)),
  (error) => (error)
)(
  tokenize(input)
)
