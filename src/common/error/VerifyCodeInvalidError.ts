import BaseError from './BaseError'

class VerifyCodeInvalidError extends BaseError {
  constructor (message = 'Verify code invalid.') {
    super(message, 400, 'VERIFY_CODE_INVALID')
  }
}

export default VerifyCodeInvalidError
