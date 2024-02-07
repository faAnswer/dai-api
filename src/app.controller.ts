import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import Helper from "@src/common/helper";
import { Body } from "@nestjs/common";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/logger')
  async logger (
    @Body('userId') userId: string,
    @Body('action') action: string,
    @Body('msg') msg: string,
  ) {

    Helper.actionLogging(userId, action, msg)

    return Helper.parseResponseBody();
  }
}
