export class ExcelChartFileCreateDto {
  charts: any
  portfolioSummaryTextFieldList: any
  stockInfoList: any
  tradeDetailTextFieldList: any
  viewVisble: {
    INSTRUMENT_CHARACTERISTICS?: boolean
    HISTORICAL_INTRADAY_PROFILES?: boolean
    TRADE_SCHEDULE_ESTIMATE?: boolean
    OPTIMIZED_PARAMETERS?: boolean
    PORTFOLIO_SUMMARY?: boolean
    PORTFOLIO_BREAKDOWN?: boolean
  }
}