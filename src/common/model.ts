export interface ProfileDataType {
  name: string
  type: string
  createdDate: string
  lastUpdateDate: string
  lastUsedDate: string
  input: any
  excel: any
  viewVisble: any
  layout: any
  permission: string
}

export interface SharedLinkDataType {
  currentPage: string
  portfolioData: Object
  singleStockData: Object
}

export interface ExcelChartDataType {
  charts: Array<ChartType>
  portfolioSummaryTextFieldList: Array<Object>
  stockInfoList: Array<StockInfoListType>
  tradeDetailTextFieldList: Array<Object>
  viewVisble: {
    INSTRUMENT_CHARACTERISTICS?: boolean
    HISTORICAL_INTRADAY_PROFILES?: boolean
    TRADE_SCHEDULE_ESTIMATE?: boolean
    OPTIMIZED_PARAMETERS?: boolean
    PORTFOLIO_SUMMARY?: boolean
    PORTFOLIO_BREAKDOWN?: boolean
  }
}

export interface ChartType {
  chartTitle: string
  data: any
  fields: Array<string>
  titles: Array<string>
  chart?: string
  symbol?: string
}

export interface StockInfoListType {
  symbol: string
  optimizedParameters: [] | Array<OptimizedParametersType>
}

interface OptimizedParametersType {
  label: string
  value: string
  type: string
}