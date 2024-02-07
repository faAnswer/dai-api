import { Test, TestingModule } from '@nestjs/testing'
import { RestfulApiController } from './restfulApi.controller'
import { RestfulApiService } from './restfulApi.service'

describe('RestfulApiController', () => {
  let controller: RestfulApiController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestfulApiController],
      providers: [RestfulApiService],
    }).compile()

    controller = module.get<RestfulApiController>(RestfulApiController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
