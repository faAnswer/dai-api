import BaseError from './BaseError'

class RequestFailedError extends BaseError {
  constructor (message = 'Request failed.') {
    super(message, 400, 'REQUEST_FAILED')
  }
}

export default RequestFailedError
