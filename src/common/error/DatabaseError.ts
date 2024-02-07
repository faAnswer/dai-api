import BaseError from './BaseError'

class DatabaseError extends BaseError {
  constructor (message = 'Database Error.') {
    super(message, 400, 'DATABASE_ERROR')
  }
}

// export default DatabaseError
export default DatabaseError
