const axios = require('axios')
const https = require('https')
import envConfig from '@src/common/config/env'
import * as path from "path";

const fs = require('fs')

// const keyFilePath = path.resolve(process.cwd(), './ssl/server.key.pem');
// const crtFilePath = path.resolve(process.cwd(), './ssl/server.crt.pem');
//
// const keyFile = fs.readFileSync(keyFilePath)
// const certFile = fs.readFileSync(crtFilePath)


const customApiClient = ({ timeout }) => {
  const apiClient = axios.create({
    baseURL: envConfig.daiwaApiHost,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      timeout: timeout,
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
      if (!error.response) {
        // console.log(error)
        // console.log(envConfig.daiwaApiHost)
        throw 'Error: Network Error'
      } else {
        throw error.response.data.errors
      }
    },
  )
  return apiClient
}

export default customApiClient
