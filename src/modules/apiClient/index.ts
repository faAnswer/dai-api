import * as path from "path";

const axios = require('axios')
const https = require('https')
import envConfig from '@src/common/config/env'
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
const fs = require('fs')

//
// const keyFilePath = path.resolve(process.cwd(), './ssl/server.key.pem');
// const crtFilePath = path.resolve(process.cwd(), './ssl/server.crt.pem');
//
// const keyFile = fs.readFileSync(keyFilePath)
// const certFile = fs.readFileSync(crtFilePath)

const apiClient = axios.create({
  baseURL: envConfig.daiwaApiHost,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    timeout: 90000,
    // cert: certFile,
    // key: keyFile,
    // ca: certFile,
  }),
})

apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    throw new InternalServerErrorException('Rest API Call Fail')
  },
)

export default apiClient
