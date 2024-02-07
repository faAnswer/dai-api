import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Query,
} from '@nestjs/common'
import { ExcelFileService } from './excelFile.service'
import { Response, Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { ExcelType } from '@src/common/enum/excelFile'
import envConfig from '@src/common/config/env'
const multer = require('multer')
import { RecordValidationError } from '@src/common/error'
import { ExcelTypeValidationPipe } from './excelFileValidator'
import { ExcelChartFileCreateDto } from './excelFile.dto'
import { Headers } from '@nestjs/common'
import Helper from '@src/common/helper'

@Controller()
export class ExcelFileController {
  constructor (private readonly excelFileService: ExcelFileService) {}

  @Post('/excel-chart-file')
  async getExcelFile (
    @Body('chartData') chartData: ExcelChartFileCreateDto,
    @Res() res: Response,
    @Headers('userId') userId: string,
  ) {
    await this.excelFileService.filterChartData(chartData)
    const { excelData } = await this.excelFileService.createAndSaveExcelFiles({
      chartData,
    })
    res.set({
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Disposition': 'attachment; filename=chart.xlsx',
      'Content-Length': excelData.length,
    })
    res.status(200).send(excelData)
  }

  @Get('/excel-template/:templateType')
  async getExcelTemplate (
    @Param('templateType', ExcelTypeValidationPipe)
    templateType: ExcelType,
    @Res() res: Response,
    @Headers('userId') userId: string,
  ) {
    const excelData = await this.excelFileService.readExcelFile({
      filePath:
        templateType === ExcelType.SINGLE_STOCK
          ? envConfig.singleStockExcelTemplatePath
          : envConfig.portfolioExcelTemplatePath,
    })
    res.set({
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Disposition': 'attachment; filename=chart.xlsx',
      'Content-Length': excelData.length,
    })

    res.status(200).send(excelData)
  }
}
