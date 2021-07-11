import { Controller, Param, Put } from '@nestjs/common';
import { ApiImplicitParam, ApiResponse } from '@nestjs/swagger';
import { PipedriveService } from './pipedrive.service';

@Controller('pipedrive')
export class PipedriveController {
  constructor(private readonly pipedriveService: PipedriveService) {}

  @Put(':commentId')
  @ApiResponse({
    status: 201,
    description: 'Push a comment by id to the pipedrive crm',
  })
  @ApiImplicitParam({ name: 'commentId', required: true, type: Number })
  async editNote(@Param('commentId') commentId: number) {
    return await this.pipedriveService.editNote(commentId);
  }
}
