import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: parseInt(process.env.PORT, 10),
  singleStockExcelTemplatePath: process.env.SINGLE_STOCK_EXCEL_TEMPLATE_PATH || 'static/excelTemplate/singleStockInputTemplate.xlsx',
  portfolioExcelTemplatePath: process.env.PORTFOLIO_EXCEL_TEMPLATE_PATH || 'static/excelTemplate/portfolioInputTemplate.xlsx',
  singleStockProfileTemplatePath: process.env.SINGLE_STOCK_PROFILE_TEMPLATE_PATH,
  portfolioProfileTemplatePath: process.env.PORTFOLIO_PROFILE_TEMPLATE_PATH,
  excelTemplateFolderPath: process.env.EXCEL_TEMPLATE_FOLDER_PATH || 'static/excelTemplate/',
  daiwaApiHost: process.env.DAIWA_API_HOST,
  enableSocket: process.env.ENABLE_SOCKET === '1' ? true : false,
  apiTimeoutPerStock: process.env.API_TIMEOUT_PER_STOCK,
  removeSharedlinkDataTime: parseInt(process.env.REMOVE_SHARED_LINK_DATA_CONFIG, 10)
}
