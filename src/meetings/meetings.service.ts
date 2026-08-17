

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {}

  async create(dto: CreateMeetingDto, createdById: number): Promise<Meeting> {
    const meeting = this.meetingRepository.create({
      ...dto,
      created_by: createdById,
    });
    return this.meetingRepository.save(meeting);
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingRepository.find({
      order: { meeting_date: 'ASC', meeting_time: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({ where: { id } });

    if (!meeting) {
      throw new NotFoundException(`Meeting with id ${id} not found`);
    }

    return meeting;
  }

  async update(id: number, dto: UpdateMeetingDto): Promise<Meeting> {
    const meeting = await this.findOne(id);
    Object.assign(meeting, dto);
    return this.meetingRepository.save(meeting);
  }

  async remove(id: number): Promise<void> {
    const meeting = await this.findOne(id);
    await this.meetingRepository.remove(meeting);
  }
}