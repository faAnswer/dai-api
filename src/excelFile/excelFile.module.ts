import { Module } from '@nestjs/common'
import { ExcelFileService } from './excelFile.service'
import { ExcelFileController } from './excelFile.controller'
import { MulterModule } from '@nestjs/platform-express'
import { SingleModule } from "@src/single/single.module";
@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/csv',
    }),
    SingleModule
  ],
  controllers: [ExcelFileController],
  providers: [ExcelFileService],
})
export class ExcelFileModule {}
