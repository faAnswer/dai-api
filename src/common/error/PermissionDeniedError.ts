import BaseError from './BaseError'

class PermissionDeniedError extends BaseError {
  constructor (message = 'Permission denied') {
    super(message, 400, 'PERMISSION_DENIED')
  }
}

export default PermissionDeniedError
