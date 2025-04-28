import { Test, TestingModule } from '@nestjs/testing';
import { WebhookLogsController } from './webhook-logs.controller';

describe('WebhookLogsController', () => {
  let controller: WebhookLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookLogsController],
    }).compile();

    controller = module.get<WebhookLogsController>(WebhookLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
