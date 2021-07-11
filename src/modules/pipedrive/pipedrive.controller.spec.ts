import { Test, TestingModule } from '@nestjs/testing';
import { PipedriveController } from './pipedrive.controller';
import { PipedriveService } from './pipedrive.service';

describe('Testing comments Controller', () => {
  const mockPipedriveService = {};

  let controller: PipedriveController;

  beforeEach(async () => {
    // Creating a mock for the PipedriveModule
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipedriveController],
      providers: [PipedriveService],
    })
      .overrideProvider(PipedriveService)
      .useValue(mockPipedriveService)
      .compile();

    controller = module.get<PipedriveController>(PipedriveController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });
});
