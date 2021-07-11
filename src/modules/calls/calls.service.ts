import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCallDto } from './calls.dto';
import { Call } from './calls.entity';

@Injectable()
export class CallService {
  constructor(
    @InjectRepository(Call) private readonly callRepository: Repository<Call>,
  ) {}

  async createCall(dto: CreateCallDto) {
    return await this.callRepository.save(dto);
  }

  async getCalls() {
    return await this.callRepository.find();
  }

  async getCall(id: number) {
    return await this.callRepository.findOne(id, {
      relations: ['comments'],
    });
  }
}
