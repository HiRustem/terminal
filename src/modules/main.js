import parseInvocations from "../modules/semantic-grammar.js";
import lexicalAnalysis from "./lexical-grammar.js";

var inputElement = document.getElementById("input");

inputElement.addEventListener("change", (event) => {
  var start = Date.now();

  var lexical = lexicalAnalysis(event.target.value);
  var invocations = parseInvocations(lexical);

  console.log('lexical', lexical);
  console.log('invocations', invocations);
  var end = Date.now();
  console.log("milliseconds:", end - start);
});