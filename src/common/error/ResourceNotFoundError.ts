import BaseError from './BaseError'

class ResourceNotFoundError extends BaseError {
  constructor (message = 'Resource not found.') {
    super(message, 404, 'RESOURCE_NOT_FOUND')
  }
}

export default ResourceNotFoundError
