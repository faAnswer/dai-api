export default {
  fetchInfo: () => 'info',
  fetchAnalytic: () => 'analytics',
  fetchIntermediate: () => 'intermediate',
  fetchTradeSchedue: () => 'tradeSchedue',
  fetchOptimizedParams: () => 'optimizedParams',
  fetchVolumeCurve: () => 'volumeCurve',
  fetchInputData: () => 'inputData',
  login: () => global.routeToFailure? 'login/fail': 'login'
  // fetchAdditionalParams: () => 'inputParams',
  // fetchSpreadCurve: () => 'spreadCurve',
  // fetchVolatilityCurve: () => 'volatilityCurve',
  // fetchCurrencyRate: () => 'ccyRate',
}

