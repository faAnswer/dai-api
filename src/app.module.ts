import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ExcelFileModule } from './excelFile/excelFile.module'
import { WsStartGateway } from './ws/ws.gateway'
import { RestfulApiModule } from './restfulApi/restfulApi.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SingleModule } from './single/single.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    ExcelFileModule,
    RestfulApiModule,
    SingleModule
  ],
  controllers: [AppController],
  providers: [WsStartGateway, AppService]
})
export class AppModule { }
