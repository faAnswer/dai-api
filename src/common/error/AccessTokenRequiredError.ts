import BaseError from './BaseError'

class AccessTokenRequiredError extends BaseError {
  constructor (message = 'Access token missing in authorization header.') {
    super(message, 400, 'ACCESS_TOKEN_REQUIRED')
  }
}

export default AccessTokenRequiredError
