import BaseError from './BaseError'

class WebviewFunctionError extends BaseError {
  constructor (message = 'Webview Function is Disabled.') {
    super(message, 400, 'WEBVIEW_FUNCTION_ERROR')
  }
}

export default WebviewFunctionError
