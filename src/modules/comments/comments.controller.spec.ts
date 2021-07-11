import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';

describe('Testing comments Controller', () => {
  const mockCommentService = {
    createComment: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    getComment: jest.fn((id) => {
      return {
        id: id,
        callId: 4,
        comment: 'test comment',
        timestamp: '00:12:11',
        createdAt: '2021-07-08 11:51:46',
        call: {
          id: 4,
          name: 'myTest',
          date: '2022-01-01T08:08:08.000Z',
          duration: 600,
          crmActivityId: null,
        },
      };
    }),
  };

  let controller: CommentController;

  beforeEach(async () => {
    // Creating a mock for the CommentModule
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [CommentService],
    })
      .overrideProvider(CommentService)
      .useValue(mockCommentService)
      .compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a comment', async () => {
    const dto = {
      comment: 'test for test comment',
      callId: 1,
      timestamp: '00:00:00',
    };
    const result = await controller.createComment(dto);
    expect(result).toEqual({
      id: expect.any(Number),
      ...dto,
    });

    expect(mockCommentService.createComment).toBeCalledWith(dto);
  });

  it('should get the comment by id', async () => {
    const id = 1;
    const result = await controller.getComment(id);
    expect(result).toEqual({
      id: 1,
      callId: 4,
      comment: 'test comment',
      timestamp: '00:12:11',
      createdAt: '2021-07-08 11:51:46',
      call: {
        id: 4,
        name: 'myTest',
        date: '2022-01-01T08:08:08.000Z',
        duration: 600,
        crmActivityId: null,
      },
    });
  });
});
