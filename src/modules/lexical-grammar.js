import { INVALID_PATTERN_NAME, KEYWORD_PATTERN_NAME, PATTERN_HANDLERS, QUOTE_SYMBOL_PATTERN, SPACE_BAR_PATTERN } from "../constants/pattern.js";
import { TOKEN_SUFFIX } from "../constants/token/token.js";
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

var getLexicalTokens = (substrings) => (
  substrings.reduce(
    (accumulator, current) => {
      if (!accumulator.isValid) {
        return accumulator;
      }

      var currentToken = getToken(current);
      
      if (!currentToken.isValid) {
        return returnInvalid(`Unknown pattern: ${current === "" ? "extra space" : current}`)
      }

      accumulator.valid.push(currentToken);

      return accumulator;
    }, {
      isValid: true,
      valid: []
    }
  )
);

var getToken = (input, patternToCheck = KEYWORD_PATTERN_NAME) => {
  if (patternToCheck === INVALID_PATTERN_NAME) {
    return returnInvalid(`Not valid pattern: ${input}`);
  }

  if (input.match(PATTERN_HANDLERS[patternToCheck].pattern)) {
    return returnValid({
      type: `${patternToCheck}-${TOKEN_SUFFIX}`,
      value: input,
    });
  }

  return getToken(input, PATTERN_HANDLERS[patternToCheck].next);
}

export default (input) => validate(
  ({ valid }) => (getLexicalTokens(valid)),
)(
  tokenize(input)
)
