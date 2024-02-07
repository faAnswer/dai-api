import BaseError from './BaseError'

class DuplicatedError extends BaseError {
  constructor (message = 'Duplicated invalid.') {
    super(message, 400, 'DUPLICATED_INVALID')
  }
}

export default DuplicatedError
