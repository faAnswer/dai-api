import BaseError from './BaseError'

class LoginFailedError extends BaseError {
  constructor (message = 'Username or password incorrect.') {
    super(message, 400, 'LOGIN_FAILED')
  }
}

export default LoginFailedError
