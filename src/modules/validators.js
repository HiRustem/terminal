export var validate = (onValid, onInvalid) => (value) => (
  value.isValid ? (
    onValid ? onValid(value) : value
  ) : (
    onInvalid ? onInvalid(value) : value
  )
);

export var returnValid = (valid) => ({ isValid: true, valid });

export var returnInvalid = (error) => ({ isValid: false, error });