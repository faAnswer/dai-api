import BaseError from './BaseError'

class SchemaValidationError extends BaseError {
  errors: {}
  constructor (validationErrors = {}) {
    super('Schema validation error.', 400, 'SCHEMA_VALIDATION_ERROR')
    this.errors = validationErrors
  }
}

export default SchemaValidationError
