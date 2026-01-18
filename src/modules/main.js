import validateTokens from "../constants/token/token.js";
import lexicalAnalysis from "./lexical-grammar.js";

var inputElement = document.getElementById("input");

inputElement.addEventListener("change", (event) => {
  var start = Date.now();
  console.log(
    validateTokens(
      lexicalAnalysis(event.target.value)
    )
  );
  var end = Date.now();
  console.log("milliseconds:", end - start);
});