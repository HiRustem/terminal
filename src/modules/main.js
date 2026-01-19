import parseInvocations from "../modules/semantic-grammar.js";
import lexicalAnalysis from "./lexical-grammar.js";

var inputElement = document.getElementById("input");

inputElement.addEventListener("change", (event) => {
  var start = Date.now();

  console.log(
    parseInvocations(
      lexicalAnalysis(
        event.target.value
      )
    )
  );
  var end = Date.now();
  console.log("milliseconds:", end - start);
});