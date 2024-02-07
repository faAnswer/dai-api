import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('Step 0: Testing Env Init', () => {

    expect(service).toBeDefined()
  })

  it('Step 1: Login Success', async () => {


    const res = await service.login({userId: 'vioo', password: '123'})

    expect(res.login).toEqual(1)
  })

  it('Step 2: Login Failure', async () => {

    global.routeToFailure = true

    const res = await service.login({userId: 'vioo', password: '123'})

    expect(res.login).toEqual(0)
  })
})
