import { Test, TestingModule } from '@nestjs/testing';
import { WebhookLogsService } from './webhook-logs.service';

describe('WebhookLogsService', () => {
  let service: WebhookLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookLogsService],
    }).compile();

    service = module.get<WebhookLogsService>(WebhookLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
