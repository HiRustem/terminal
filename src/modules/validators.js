export var isValid = (onValid, onInvalid) => (value) => (value.isValid ? onValid(value) : onInvalid(value));

export var returnValid = (value) => ({ isValid: true, value });

export var returnInvalid = (error) => ({ isValid: false, error });
