import { Test, TestingModule } from '@nestjs/testing';
import { RestfulApiService } from './restfulApi.service';

describe('RestfulApiService', () => {
  let service: RestfulApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestfulApiService],
    }).compile();

    service = module.get<RestfulApiService>(RestfulApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
