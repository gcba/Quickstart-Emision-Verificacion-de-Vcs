import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AgentService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AgentService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(AppController);
      expect(appController.getInvitationMessage()).toBe('Hello World!');
    });
  });
});
