import { Controller, Get, Post, Body } from '@nestjs/common'
import { PostIntermediate, RestfulApiService } from "./restfulApi.service";
import { Headers } from '@nestjs/common';
import Helper from "@src/common/helper";
import { PostIntermediateReqDto } from "@src/restfulApi/dto/postIntermediate.dto";


@Controller()
export class RestfulApiController {
  constructor (private readonly restfulApiService: RestfulApiService) {}

  @Post('/info')
  async getInfo (@Body() stockInfoList) {
    return this.restfulApiService.getInfo(stockInfoList)
  }

  @Post('/analytics')
  async getAnalytics (@Body() stockInfoList,  @Headers('userId') userId: string) {

    return this.restfulApiService.getAnalytics(stockInfoList)
  }
  @Post('/intermediate')
  async postIntermediate (@Body() stockInfoList: PostIntermediateReqDto[],  @Headers('userId') userId: string): Promise<PostIntermediate[]> {

    return this.restfulApiService.postIntermediate(stockInfoList)
  }
  @Post('/volume-curve')
  async getVolumeCurve (@Body() stockInfoList) {
    return this.restfulApiService.getVolumeCurve(stockInfoList)
  }

  @Post('/optimized-params')
  async getOptimizedParams (@Body() stockInfoList, @Headers('userId') userId: string) {

    if(stockInfoList.length == 1) {

      let msg;

      const singleStock = stockInfoList[0]

      if (singleStock.OrdType === 'MARKET') {


        msg = `{symbol=${singleStock.Symbol}, qty=${singleStock.OrderQty}, orderType=Market, Strategy=${singleStock.Strategy}, customerID=${singleStock.CustomerId ?? ''}}`

      } else if (singleStock.OrdType === 'LIMIT') {

        msg = `{symbol=${singleStock.Symbol}, qty=${singleStock.OrderQty}, orderType=Limit, price=${singleStock.Price}, Strategy=${singleStock.Strategy}, customerID=${singleStock.CustomerId}}`

      }
    }
    return this.restfulApiService.getOptimizedParams(stockInfoList)
  }

  @Get('/input-data')
  async getInputData () {
    return this.restfulApiService.getInputData()
  }
  
}
