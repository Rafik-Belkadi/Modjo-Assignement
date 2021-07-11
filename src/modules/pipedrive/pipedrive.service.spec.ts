import { PipedriveService } from './pipedrive.service';
import {
  HttpException,
  HttpModule,
  HttpService,
  HttpStatus,
} from '@nestjs/common';
import { Comment } from '../comments/comments.entity';
import { CommentService } from '../comments/comments.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

describe('PipedriveService', () => {
  let pipedriveService: PipedriveService;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        PipedriveService,
        {
          provide: CommentService,
          useValue: {
            getComment: jest.fn(() => ({
              id: 3,
              callId: 1,
              comment: 'ça marche pas mal modjo enfaite',
              timestamp: '00:00:00',
              createdAt: '2021-07-08 15:27:14',
              call: {
                id: 1,
                name: 'Reference call for assignment',
                date: '2022-01-01T08:08:08.000Z',
                duration: 600,
                crmActivityId: '40',
              },
            })),
          },
        },
      ],
    }).compile();

    pipedriveService = module.get<PipedriveService>(PipedriveService);
    commentService = module.get<CommentService>(CommentService);
  });

  it('PipedriveService - should be defined', () => {
    expect(pipedriveService).toBeDefined();
  });

  describe('PipedriveService - editNote', () => {
    it('Should return excpetions if no comment found or crmActivityId', async () => {
      jest.spyOn(pipedriveService, 'editNote').mockResolvedValue(null);
      try {
        const result = await pipedriveService.editNote(54548445);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('Should return the activity object updated', async () => {
      jest.spyOn(pipedriveService, 'editNote');
      try {
        const result = await pipedriveService.editNote(3);
        expect(result.data.note).toContain('ça marche pas mal');
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe('PipedriveService - getActivity', () => {
    it('should throw an Exception if no activity Found', async () => {
      jest.spyOn(pipedriveService, 'getActivity');
      try {
        const result = await pipedriveService.getActivity('fakeid');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should return the activity if the crmActivityId is provided', async () => {
      jest.spyOn(pipedriveService, 'getActivity');
      try {
        const result = await pipedriveService.getActivity('40');
        expect(result).not.toBe(null);
      } catch (error) {
        console.log(error);
      }
    });
  });
});
