import excelToJson = require('convert-excel-to-json')
const fs = require('fs')
// const moment = require('moment')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc');
const path = require('path')

export default class Helper {
  public static async generateExcelChartFile ({ data, xlsxChart }) {
    return new Promise(function (resolve, reject) {
      xlsxChart.generate(data, function (err: any, chartData: any) {
        if (err) {
          reject(err)
        } else {
          resolve(chartData)
        }
      })
    })
  }

  public static async convertExcelToJson ({ filePath }) {
    return excelToJson({
      source: fs.readFileSync(filePath), // fs.readFileSync return a Buffer
      columnToKey: {
        '*': '{{columnHeader}}',
      },
    })['Sheet1'].slice(1)
  }

  public static async getAllFilesPathFromFolder ({ folderPath }) {
    const filePathList = []
    fs.readdirSync(folderPath).forEach(function (name) {
      if (name.includes('.DS_Store')) {
        return
      }
      var filePath = path.join(folderPath, name)
      filePathList.push(filePath)
    })
    return filePathList
  }

  public static async isFolderExist ({ path }) {
    return fs.existsSync(path)
  }

  public static async createFolder ({ folderPath }) {
    fs.mkdirSync(folderPath)
  }

  public static async createFile ({ folderPath, content }) {
    fs.writeFileSync(folderPath, content)
  }

  public static async writeFile ({ folderPath, content, mode = 'OVERWRITE' }) {
    switch (mode) {
      case 'OVERWRITE':
        break
      case 'APPEND':
        break
      default:
        break
    }
    return fs.writeFileSync(folderPath, content, 'utf8')
  }

  public static async renameFile ({currentFilePath, newFileName}) {
    const currentDir = path.dirname(currentFilePath);
    const newFilePath = path.join(currentDir, newFileName);
    fs.renameSync(currentFilePath, newFilePath);
  }

  public static async readFile ({ folderPath }) {
    return fs.readFileSync(folderPath, { encoding: 'utf8', flag: 'as+' })
  }

  public static async deleteFile ({ filePath }) {
      fs.unlinkSync(filePath);
  }

  public static async getCurrentTimeString (format = 'YYYY-MM-DD hh:mm:ss') {
    return dayjs().format(format)
  }

  public static parseResponseBody ({
    code = 'OK',
    status = 200,
    message = 'success',
    data = {},
    meta = {},
  } = {}) {
    let response = {
      code,
      status,
      message,
    }
    if (data) {
      response['data'] = data
    }
    if (meta) {
      response['meta'] = meta
    }
    return response
  }
  public static actionLogging(userId: string, action: string, msg: string): void{

    dayjs.extend(utc);

    const datetime = dayjs().utc().utcOffset(8).format('YYYY-MM-DD HH:mm:ss (Z)');

    console.log(`${datetime} - ${userId}: ${action}, ${msg}`);

  }
}
