import BaseError from './BaseError'

class RecordValidationError extends BaseError {
  constructor (message = 'Record invalid.') {
    super(message, 400, 'RECORD_INVALID')
  }
}

export default RecordValidationError
