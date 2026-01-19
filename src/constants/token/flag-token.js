import { returnInvalid, returnValid } from "../../modules/validators.js";
import { FLAG_TOKEN_NAME } from "./token.js";

export var FLAG_TOKEN_VARIANT_NAME = "flag-name";

export var parseFlagToken = (input) => {
  if (input.current.type === FLAG_TOKEN_NAME) {
    return returnValid({
      type: FLAG_TOKEN_VARIANT_NAME,
      value: input.current.value,
    });
  }

  return returnInvalid(`Invalid flag token: ${input.current.value}`);
}