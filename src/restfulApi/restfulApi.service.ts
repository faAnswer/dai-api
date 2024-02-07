import { Injectable } from '@nestjs/common'
import pathConfig from '@src/common/config/pathConfig'
import apiClient from '@src/modules/apiClient'
import customApiClient from '@src/modules/customApiClient'
import envConfig from '@src/common/config/env'
import { StockInfo } from "@src/restfulApi/dto/postIntermediate.dto";

export type PostIntermediate = {
  symbol: string;
  VOLUME_0: {
    times: string[]; //ISO Datetime
    data: number[];
  };
  VOLUME_60: {
    amClose: number;
    pmOpen: number;
    pmClose: number;
    amOpen: number;
  };
};

@Injectable()
export class RestfulApiService {
  async getInfo (stockInfoList) {
    return apiClient.post(pathConfig.fetchInfo(), stockInfoList)
  }

  async getAnalytics (stockInfoList) {
    const timeout = stockInfoList.length * 30000
    const apiClient = customApiClient({ timeout })
    return apiClient.post(pathConfig.fetchAnalytic(), stockInfoList)
  }

  async postIntermediate (stockInfoList: StockInfo[]): Promise<PostIntermediate[]> {
    const timeout = stockInfoList.length * 30000
    const apiClient = customApiClient({ timeout })
    return apiClient.post(pathConfig.fetchIntermediate(), stockInfoList)
  }
  async getVolumeCurve (stockInfoList) {
    const timeout = stockInfoList.length * 30000
    const apiClient = customApiClient({ timeout })
    return apiClient.post(pathConfig.fetchVolumeCurve(), stockInfoList)
  }

  async getOptimizedParams (stockInfoList) {
    const timeout = stockInfoList.length * 30000
    const apiClient = customApiClient({ timeout })
    return apiClient.post(pathConfig.fetchOptimizedParams(), stockInfoList)
  }

  async login ({ username, password }) {
    return apiClient.post(pathConfig.login(), { username, password })
  }

  async getInputData () {
    return apiClient.get(pathConfig.fetchInputData())
  }
}
