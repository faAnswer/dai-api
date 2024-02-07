import { Module } from '@nestjs/common';
import { RestfulApiService } from './restfulApi.service';
import { RestfulApiController } from './restfulApi.controller';

@Module({
  controllers: [RestfulApiController],
  providers: [RestfulApiService],
  exports: [RestfulApiService]
})
export class RestfulApiModule {}
