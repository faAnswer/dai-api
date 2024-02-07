import { Module } from '@nestjs/common';
import { SingleController } from './single.controller';
import { SingleService } from './single.service';
import { RestfulApiModule } from "@src/restfulApi/restfulApi.module";

@Module({
  controllers: [SingleController],
  providers: [SingleService],
  imports: [RestfulApiModule],
  exports: [SingleService]
})
export class SingleModule {}
