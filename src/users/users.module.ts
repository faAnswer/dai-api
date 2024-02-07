import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
