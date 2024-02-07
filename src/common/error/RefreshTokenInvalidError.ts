import BaseError from './BaseError'

class RefreshTokenInvalidError extends BaseError {
  constructor (message = 'Refresh token invalid.') {
    super(message, 400, 'REFRESH_TOKEN_INVALID')
  }
}

export default RefreshTokenInvalidError
