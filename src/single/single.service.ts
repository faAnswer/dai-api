import { Injectable } from '@nestjs/common';
import { PostIntermediate, RestfulApiService } from "@src/restfulApi/restfulApi.service";
import { StockInfo } from "@src/restfulApi/dto/postIntermediate.dto";

export type IntermediateDetails = {
  date: string; //ISO Datetime VOLUME_0.data.times
  moo: {
    data: number; //VOLUME_60.amOpen
    avg: number; //(VOLUME_60.amOpen / VOLUME_0.data)
  }
  moc: {
    data: number; //VOLUME_60.pmClsoe
    avg: number; //(VOLUME_60.pmClsoe / VOLUME_0.data)
  }
}

export type Intermediate = {
  symbol: string;
  details: IntermediateDetails[];
}

@Injectable()
export class SingleService {

  constructor(private restfulApiService: RestfulApiService) {
  }

  async fetchIntermediate(stockInfoList: StockInfo[]): Promise<Intermediate[]> {

    const data = await this.restfulApiService.postIntermediate(stockInfoList)

    console.log('data', data)

    return this.intermediateConvert({stockInfoList, data})
  }

  private intermediateConvert(obj: {stockInfoList: StockInfo[], data: PostIntermediate[] }): Intermediate[] {

    const map = new Map<string, IntermediateDetails[]>()

    obj.data.forEach((item) => {

      if(!map.has(item.symbol)) {

        map.set(item.symbol, [])
      }
      map.get(item.symbol).push({
        date: item.VOLUME_0.times[0],
        moo: {
          data: item.VOLUME_60.amOpen,
          avg: item.VOLUME_60.amOpen / item.VOLUME_0.data[0]
        },
        moc: {
          data: item.VOLUME_60.pmClose,
          avg: item.VOLUME_60.pmClose / item.VOLUME_0.data[0]
        }
      })
    })

    const raw = obj.stockInfoList.map((item) => {
      const details = map.get(item.symbol) || [];
      details.sort((a, b) => b.date.localeCompare(a.date));
      return {
        symbol: item.symbol,
        details,
      };
    });

    return raw
  }
}
