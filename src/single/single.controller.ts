import { Controller, Get } from "@nestjs/common";
import { Body, Headers, Post } from "@nestjs/common";
import { PostIntermediate } from "@src/restfulApi/restfulApi.service";
import { PostIntermediateReqDto } from "@src/single/dto/postIntermediate.dto";
import { Intermediate, SingleService } from "@src/single/single.service";

@Controller('single')
export class SingleController {

constructor (private readonly singleService: SingleService) {}

  @Post('/intermediate')
  async postIntermediate (@Body() stockInfoList: PostIntermediateReqDto[],  @Headers('userId') userId: string): Promise<Intermediate[]> {

    return this.singleService.fetchIntermediate(stockInfoList)
  }
}
