import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiImplicitBody,
  ApiImplicitParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateCallDto } from './calls.dto';
import { CallService } from './calls.service';

@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  /** Create a call in database with this endpoint */
  @Post()
  @ApiImplicitBody({ name: 'CreateCallDto', type: CreateCallDto })
  async createCall(@Body() dto: CreateCallDto) {
    return await this.callService.createCall(dto);
  }

  /** List all calls in database with this endpoint */
  @Get()
  @ApiOkResponse({ description: 'Get All Calls' })
  async getCalls() {
    return await this.callService.getCalls();
  }

  /** Get call by id in database with this endpoint */
  @Get(':id')
  @ApiOkResponse({ description: 'Get Call by id' })
  @ApiImplicitParam({ name: 'id', required: true, type: Number })
  async getCall(@Param('id') id: number) {
    return await this.callService.getCall(id);
  }
}
