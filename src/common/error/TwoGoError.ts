import BaseError from './BaseError'

class TwoGoError extends BaseError {
  constructor (message = 'TwoGo Error.', code = 'TwoGo_Error') {
    super(message, 400, code)
  }
}

export default TwoGoError
