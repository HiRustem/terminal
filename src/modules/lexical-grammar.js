import { patternHandlers, QUOTE_SYMBOL_PATTERN, SPACE_BAR_PATTERN } from "../constants/patterns.js";
import { isValid, returnInvalid, returnValid } from "./validators.js";

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

var getLexicalTokens = (substrings) => (returnValid(substrings.map((item) => (getToken(item)))));

var getToken = (input, patternToCheck = "keyword") => {
  if (patternToCheck === "invalid") {
    return returnInvalid(`Not valid pattern: ${input}`);
  }

  if (input.match(patternHandlers[patternToCheck].pattern)) {
    return returnValid({
      type: `${patternToCheck}-node`,
      value: input,
    });
  }

  return getToken(input, patternHandlers[patternToCheck].next);
}

var start = Date.now();

var result = isValid(
  (valid) => (getLexicalTokens(valid.value)),
  (error) => (error)
)(
  tokenize(
    `git commit --soft -m "commit message" --flag -f -d "new message"`
  )
);

result.value.forEach((item) => (console.log(item.value)));

var end = Date.now();
console.log("result", result);
console.log("milliseconds: ", end - start);
