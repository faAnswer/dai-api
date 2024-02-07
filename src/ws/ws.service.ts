import { Injectable } from '@nestjs/common'
const axios = require('axios')
import envConfig from '@src/common/config/env'
import * as path from "path";

const https = require('https');
const fs = require('fs')

@Injectable()
export class WsService {
  getRandomFloat(min, max, decimals): number {
    const str = (Math.random() * (max - min) + min).toFixed(decimals)
    return parseFloat(str)
  }

  getMarketCondition(client: WebSocket, data: any): void {
    setInterval(() => {
      const keyFilePath = path.resolve(process.cwd(), './ssl/server.key.pem');
      const crtFilePath = path.resolve(process.cwd(), './ssl/server.crt.pem');
      
      const keyFile = fs.readFileSync(keyFilePath)
      const certFile = fs.readFileSync(crtFilePath)
      
      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
          timeout: 90000,
          cert: certFile,
          key: keyFile,
          ca: certFile,
        })
      });
      instance.post(`${envConfig.daiwaApiHost}/marketCondition`, data.stockInfoList)
        .then(function (response) {

          // handle success
          client.send(
            JSON.stringify(response.data)
          )
        })
        .catch(function (error) {
          // handle error
          // console.log(error);
        })
        .then(function () {
          // always executed
        });
    }, 2000)
  }
}
