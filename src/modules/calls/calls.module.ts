import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallController } from './calls.controller';
import { Call } from './calls.entity';
import { CallService } from './calls.service';

@Module({
  /** TypeOrmModule.forFeature([Call]) enables the call module to inject Typeorm Repositories for the Call entity */
  imports: [TypeOrmModule.forFeature([Call])],
  controllers: [CallController],
  providers: [CallService],
  /** Exporting this service lets you declare CallService in the services of Modules where you would import the CallModule
   * i.e. all you have to do to use the CallService in other services is:
   * - declare `private readonly callService: callService` in the constructor of the service where you want to use it
   * - import the CallModule in the corresponding module where you will need it
   */
  exports: [CallService],
})
export class CallModule {}
