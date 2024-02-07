import BaseError from './BaseError'

class AdvertisementFunctionError extends BaseError {
  constructor (message = 'Advertisement Function is Disabled.') {
    super(message, 400, 'ADVERTISEMENT_FUNCTION_ERROR')
  }
}

export default AdvertisementFunctionError
