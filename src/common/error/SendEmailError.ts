import BaseError from './BaseError'

class SendEmailError extends BaseError {
  constructor (message = 'SEND_EMAIL_FAILED') {
    super(message, 400, 'SEND_EMAIL_FAILED')
  }
}

export default SendEmailError
