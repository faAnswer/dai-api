import BaseError from './BaseError'

class AccessTokenInvalidError extends BaseError {
  constructor (message = 'Access token invalid.') {
    super(message, 400, 'ACCESS_TOKEN_INVALID')
  }
}

export default AccessTokenInvalidError
