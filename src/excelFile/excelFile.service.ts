import { Injectable } from '@nestjs/common'
import excelToJson = require('convert-excel-to-json')
import helper from '@src/common/helper'
const XLSXChart = require('../modules/xlsx-chart/chart')
const fs = require('fs')
const XlsxPopulate = require('xlsx-populate')
const R = require('ramda')

import { DatabaseError, RecordValidationError } from '@src/common/error'
import {
  ExcelChartDataType,
  ChartType,
  StockInfoListType,
} from '@src/common/model'
import { SingleService } from "@src/single/single.service";
@Injectable()
export class ExcelFileService {

  constructor(private singleService: SingleService) {

  }

  async createAndSaveExcelFiles ({
    chartData,
  }: {
    chartData: ExcelChartDataType
  }) {
    const xlsxChart = new XLSXChart()
    let excelData: any
    try {
      const charts = chartData.charts
      if (charts && charts.length) {
        excelData = await helper.generateExcelChartFile({
          data: R.clone(chartData),
          xlsxChart,
        })
      }
    } catch (error) {
      console.log(error)
      throw new Error('generate excel file error')
    }

    const pieChartData = chartData.charts.filter(chart => chart.chart === 'pie')
    const workbook = await this.addTextFieldsToExcelFile({
      portfolioSummaryTextFieldList: chartData['portfolioSummaryTextFieldList'],
      tradeDetailTextFieldList: chartData['tradeDetailTextFieldList'],
      excelData,
      pieChartData,
      isSingleStock: chartData['stockInfoList'].length === 1,
    })

    const updatedWorkbook = await this.addStockTabToExcel({
      charts: chartData['charts'],
      stockInfoList: chartData['stockInfoList'],
      excelData: workbook,
      isSingleStock: chartData['stockInfoList'].length === 1,
      portfolioSummaryTextFieldList: chartData['portfolioSummaryTextFieldList'],
      isDiscardChartFile: chartData.charts.length === 0,
    })
    return { excelData: updatedWorkbook }
  }

  async filterChartData (chartData: ExcelChartDataType) {
    let { viewVisble, stockInfoList, portfolioSummaryTextFieldList, charts } =
      chartData

    const {
      INSTRUMENT_CHARACTERISTICS,
      HISTORICAL_INTRADAY_PROFILES,
      TRADE_SCHEDULE_ESTIMATE,
      OPTIMIZED_PARAMETERS,
      PORTFOLIO_SUMMARY,
      PORTFOLIO_BREAKDOWN,
    } = viewVisble

    if (!OPTIMIZED_PARAMETERS && stockInfoList) {
      stockInfoList.forEach(stockInfo => {
        stockInfo.optimizedParameters = []
      })
    }

    if (!HISTORICAL_INTRADAY_PROFILES && charts) {
      charts = charts.filter(chartData => chartData.chart !== 'column')
      chartData.charts = charts
    }

    if (!PORTFOLIO_BREAKDOWN && charts) {
      charts = charts.filter(chartData => chartData.chart !== 'pie')
      chartData.charts = charts
    }

    if (!TRADE_SCHEDULE_ESTIMATE && charts) {
      charts = charts.filter(
        chartData => chartData.chart === 'column' || chartData.chart === 'pie',
      )
      chartData.charts = charts
    }

    if (INSTRUMENT_CHARACTERISTICS === false && portfolioSummaryTextFieldList) {
      portfolioSummaryTextFieldList.splice(
        0,
        portfolioSummaryTextFieldList.length,
      )
    }

    if (PORTFOLIO_SUMMARY === false && portfolioSummaryTextFieldList) {
      portfolioSummaryTextFieldList.splice(
        0,
        portfolioSummaryTextFieldList.length,
      )
    }
  }

  async addStockTabToExcel ({
    charts,
    stockInfoList,
    excelData,
    isSingleStock = false,
    portfolioSummaryTextFieldList,
    isDiscardChartFile = false,
  }: {
    charts: Array<ChartType>
    stockInfoList: Array<StockInfoListType>
    excelData: any
    isSingleStock: boolean
    portfolioSummaryTextFieldList: Array<any>
    isDiscardChartFile: boolean
  }) {
    const workbook = await XlsxPopulate.fromDataAsync(excelData)
    const { addStockSheet } = this
    stockInfoList.forEach(async stock => {
      const stockCharts = charts.filter(item => item.symbol === stock.symbol)
      if (
        !stockCharts.length &&
        !stock.optimizedParameters.length &&
        (!isSingleStock || portfolioSummaryTextFieldList.length === 0)
      ) {
        return
      }

      let newSheet = workbook.addSheet(stock.symbol, 'Chart')
      newSheet = await addStockSheet(
        newSheet,
        stock.optimizedParameters,
        stockCharts,
        isSingleStock,
        portfolioSummaryTextFieldList,
      )
    })
    if (isDiscardChartFile) {
      workbook.deleteSheet('Chart Data')
      workbook.deleteSheet('Chart')
    }
    return workbook.outputAsync()
  }

  async addStockSheet (
    newSheet1,
    textFields,
    stockCharts,
    isSingleStock = false,
    portfolioSummaryTextFieldList,
  ) {
    newSheet1.column('A').width(25)
    newSheet1.column('B').width(20).style({
      horizontalAlignment: 'right',
    })
    newSheet1.column('C').width(20).style({
      horizontalAlignment: 'right',
    })
    let yPosition = 1
    if (isSingleStock) {
      for (let textField of portfolioSummaryTextFieldList) {
        switch (textField.type) {
          case 'TITLE':
            if (yPosition !== 1) {
              yPosition += 1
            }
            newSheet1.cell(yPosition, 1).style({
              bold: true,
              fontColor: '5081bd',
            })
            newSheet1.cell(yPosition, 1).value(textField.label)
            break
          case 'FIELD':
            newSheet1.cell(yPosition, 1).value(textField.label)
            newSheet1.cell(yPosition, 2).value(textField.value)
            break
          case 'TABLE_HEAD_CELL':
            textField.label.forEach((tableHeadLabel, index) => {
              newSheet1.cell(yPosition, index + 1).style({
                bold: true,
              })
              newSheet1.cell(yPosition, index + 1).value(tableHeadLabel)
            })
            break
          case 'TABLE_CELL':
            textField.value.forEach((tableCellValue, index) => {
              const fontWeight = textField.style
                ? textField.style['fontWeight']
                : undefined
              if (fontWeight) {
                newSheet1.cell(yPosition, index + 1).style(fontWeight, true)
              }
              newSheet1.cell(yPosition, index + 1).value(tableCellValue)
            })
          default:
            break
        }
        yPosition += 1
      }
    }
    for (let textField of textFields) {
      switch (textField.type) {
        case 'TITLE':
          if (yPosition !== 1) {
            yPosition += 1
          }
          newSheet1.cell(yPosition, 1).style({
            bold: true,
            fontColor: '5081bd',
          })
          newSheet1.cell(yPosition, 1).value(textField.label)
          break
        case 'FIELD':
          newSheet1.cell(yPosition, 1).value(textField.label)
          newSheet1.cell(yPosition, 2).value(textField.value)
          break
        case 'TABLE_HEAD_CELL':
          textField.label.forEach((tableHeadLabel, index) => {
            newSheet1.cell(yPosition, index + 1).style({
              bold: true,
            })
            newSheet1.cell(yPosition, index + 1).value(tableHeadLabel)
          })
          break
        case 'TABLE_CELL':
          textField.value.forEach((tableCellValue, index) => {
            const fontWeight = textField.style
              ? textField.style['fontWeight']
              : undefined
            if (fontWeight) {
              newSheet1.cell(yPosition, index + 1).style(fontWeight, true)
            }
            newSheet1.cell(yPosition, index + 1).value(tableCellValue)
          })
        default:
          break
      }
      yPosition += 1
    }
    stockCharts.forEach(async chart => {
      yPosition += 1
      newSheet1.cell(yPosition, 1).value(chart.chartTitle).style({
        bold: true,
        fontColor: '5081bd',
      })
      yPosition += 1
      let data = []
      let row = 2
      for (const [key, value] of Object.entries(chart.data)) {
        newSheet1.cell(yPosition, row).value(key).style({
          bold: true,
        })
        data.push(value)
        row += 1
      }
      yPosition += 1
      chart.fields.forEach(async field => {
        newSheet1.cell(yPosition, 1).value(field)
        data.forEach(async (d, i) => {
          newSheet1.cell(yPosition, i + 2).value(d[field])
        })
        yPosition += 1
      })
    })

    return newSheet1
  }

  async addTextFieldsToExcelFile ({
    portfolioSummaryTextFieldList,
    tradeDetailTextFieldList,
    excelData,
    pieChartData,
    isSingleStock = false,
  }) {
    let workbook
    if (excelData) {
      workbook = await XlsxPopulate.fromDataAsync(excelData)
    } else {
      workbook = await XlsxPopulate.fromBlankAsync()
      workbook.addSheet('Chart Data')
      const defaultSheet = workbook.sheet('Sheet1')
      defaultSheet.name('Chart')
    }

    let yPosition = 1
    if (
      !isSingleStock &&
      ((portfolioSummaryTextFieldList &&
        portfolioSummaryTextFieldList.length) ||
        (pieChartData && pieChartData.length))
    ) {
      const newSheet1 = workbook.addSheet('Summary', 'Chart')
      newSheet1.column('A').width(25)
      newSheet1.column('B').width(20).style({
        horizontalAlignment: 'right',
      })
      newSheet1.column('C').width(20).style({
        horizontalAlignment: 'right',
      })

      for (let textField of portfolioSummaryTextFieldList) {
        switch (textField.type) {
          case 'TITLE':
            if (yPosition !== 1) {
              yPosition += 1
            }
            newSheet1.cell(yPosition, 1).style({
              bold: true,
              fontColor: '5081bd',
            })
            newSheet1.cell(yPosition, 1).value(textField.label)
            break
          case 'FIELD':
            newSheet1.cell(yPosition, 1).value(textField.label)
            newSheet1.cell(yPosition, 2).value(textField.value)
            break
          case 'TABLE_HEAD_CELL':
            textField.label.forEach((tableHeadLabel, index) => {
              newSheet1.cell(yPosition, index + 1).style({
                bold: true,
              })
              newSheet1.cell(yPosition, index + 1).value(tableHeadLabel)
            })
            break
          case 'TABLE_CELL':
            textField.value.forEach((tableCellValue, index) => {
              const fontWeight = textField.style
                ? textField.style['fontWeight']
                : undefined
              if (fontWeight) {
                newSheet1.cell(yPosition, index + 1).style(fontWeight, true)
              }
              newSheet1.cell(yPosition, index + 1).value(tableCellValue)
            })
          default:
            break
        }
        yPosition += 1
      }

      yPosition += 1

      pieChartData.forEach(chartData => {
        newSheet1.cell(yPosition, 1).value(chartData.chartTitle).style({
          bold: true,
          fontColor: '5081bd',
        })
        let data = []
        let row = 2
        yPosition += 1
        for (const [key, value] of Object.entries(chartData.data)) {
          newSheet1.cell(yPosition, row).value(key).style({
            bold: true,
          })
          data.push(value)
          row += 1
        }
        row += 1
        yPosition += 1
        chartData.fields.forEach(field => {
          newSheet1.cell(yPosition, 1).value(field)
          data.forEach(async (d, i) => {
            newSheet1.cell(yPosition, i + 2).value(d[field])
          })
          yPosition += 1
        })
        yPosition += 1
      })
    }
    yPosition = 1
    if (tradeDetailTextFieldList) {
      const newSheet2 = workbook.addSheet('Trade Details', 'Chart')
      for (let textField of tradeDetailTextFieldList) {
        switch (textField.type) {
          case 'TITLE':
            if (yPosition !== 1) {
              yPosition += 1
            }
            newSheet2.cell(yPosition, 1).style({
              bold: true,
              fontColor: '5081bd',
            })
            newSheet2.cell(yPosition, 1).value(textField.label)
            break
          case 'FIELD':
            newSheet2.cell(yPosition, 1).value(textField.label)
            newSheet2.cell(yPosition, 2).value(textField.value)
            break
          case 'TABLE_HEAD_CELL':
            textField.label.forEach((tableHeadLabel, index) => {
              newSheet2.cell(yPosition, index + 1).style({
                bold: true,
              })
              newSheet2.cell(yPosition, index + 1).value(tableHeadLabel)
            })
            break
          case 'TABLE_CELL':
            textField.value.forEach((tableCellValue, index) => {
              const fontWeight = textField.style
                ? textField.style['fontWeight']
                : undefined
              if (fontWeight) {
                newSheet2.cell(yPosition, index + 1).style(fontWeight, true)
              }
              newSheet2.cell(yPosition, index + 1).value(tableCellValue)
            })
          default:
            break
        }
        yPosition += 1
      }
    }
    return workbook.outputAsync()
  }

  async readExcelFile ({ filePath }) {
    const workbook = await XlsxPopulate.fromFileAsync(filePath)
    return workbook.outputAsync()
  }

  async getUploadedExcelFileList ({ filePathList }) {
    const uploadedExcelFileList = []
    for (let file of filePathList) {
      const { filepath, name, excelType, createdAt, id } = file
      const dataList = await helper.convertExcelToJson({ filePath: filepath })
      uploadedExcelFileList.push({
        dataList,
        fileName: name.split('-')[1],
        excelType,
        createdAt,
        id,
      })
    }
    return uploadedExcelFileList
  }
}
