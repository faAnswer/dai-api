import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsAdapter } from './ws/ws.adapter'
import { urlencoded, json } from 'express'
import envConfig from '@src/common/config/env'
import helmet from 'helmet'
import * as path from "path";

async function bootstrap() {
  const fs = require('fs')
  // const keyFilePath = path.resolve(process.cwd(), './ssl/server.key.pem');
  // const crtFilePath = path.resolve(process.cwd(), './ssl/server.crt.pem');
  //
  // const keyFile = fs.readFileSync(keyFilePath)
  // const certFile = fs.readFileSync(crtFilePath)
  const app = await NestFactory.create(
    AppModule,
    // {
    //   httpsOptions: {
    //     key: keyFile,
    //     cert: certFile,
    //   }
    // }
  )
  app.enableCors()
  app.use(helmet())
  // app.setGlobalPrefix('api')
  app.use(json({ limit: '2mb' }))
  app.use(urlencoded({ extended: true, limit: '2mb' }))
  if (envConfig.enableSocket) {
    app.useWebSocketAdapter(new WsAdapter(app))
  }
  await app.listen(envConfig.port)
}
bootstrap()
