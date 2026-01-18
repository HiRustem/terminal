import { validate } from "./validators"

var parseInvocations = (nodes) => (
  nodes.reduce(
    () => {

    }, {
      isValid: true,
      valid: {
        package: "",
        method: "",
        arguments: [],
      } 
    }
  )
);

export default (input) => validate(
  ({ valid }) => (parseInvocations(valid)),
)(
  input
);