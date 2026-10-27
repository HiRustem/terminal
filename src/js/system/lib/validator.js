import { RESULT_OBJECT_TYPE_ENUM } from '../model/constants.js';

var validateWrapper = ( onInvalid ) => ( onValid ) => ( input ) => (
  !Object.hasOwn( input, "type" ) 
  ? ( console.error( "The passed object must have a type field!" ), input )
  : input.type !== RESULT_OBJECT_TYPE_ENUM.ERROR
  ? onValid ? onValid( input ) : input
  : onInvalid ? onInvalid( input ) : input
);

export default validateWrapper;