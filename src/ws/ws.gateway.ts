import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets"
import * as WebSocket from 'ws'
import { WsService } from './ws.service'

@WebSocketGateway(5001, { path: '/marketCondition', cors: true })
export class WsStartGateway {
  @SubscribeMessage('message')
  marketCondition(client: any, data: any): any {
    const wsService = new WsService()
    // console.log(data.stockInfoList)
    wsService.getMarketCondition(client, data)
    return { event: 'message', data: data }
  }
}