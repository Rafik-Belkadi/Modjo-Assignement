import { HttpModule, Module } from '@nestjs/common';
import { CommentModule } from '../comments/comments.module';
import { PipedriveController } from './pipedrive.controller';
import { PipedriveService } from './pipedrive.service';

@Module({
  // imported CommentModule to inject its service in the PipeDriveService
  imports: [CommentModule, HttpModule],
  controllers: [PipedriveController],
  providers: [PipedriveService],
  exports: [PipedriveService],
})
export class PipedriveModule {}
