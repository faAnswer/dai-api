import { BadRequestException, PipeTransform } from '@nestjs/common'
import { isDefined, isEnum } from 'class-validator'
import { ExcelType } from '@src/common/enum/excelFile'

export class ExcelTypeValidationPipe
  implements PipeTransform<string, Promise<ExcelType>>
{
  transform (value: string): Promise<ExcelType> {
    if (isDefined(value) && isEnum(value, ExcelType)) {
      return ExcelType[value]
    } else {
      const errorMessage = `the value ${value} is not valid. See the acceptable values: ${Object.keys(
        ExcelType,
      ).map(key => ExcelType[key])}`
      throw new BadRequestException(errorMessage)
    }
  }
}
