import BaseError from './BaseError'

class PasswordIncorrectError extends BaseError {
  constructor (message = 'Password incorrect.') {
    super(message, 400, 'PASSWORD_INCORRECT')
  }
}

export default PasswordIncorrectError
