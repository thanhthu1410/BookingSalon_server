import { Injectable } from '@nestjs/common';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffService } from './entities/staff-service.entity';
import { Repository } from 'typeorm';


@Injectable()

export class StaffServicesService {

  constructor(
    @InjectRepository(StaffService)
    private StaffServiceRepository: Repository<StaffService>,
  ) { }

  async create(createStaffServiceDto: CreateStaffServiceDto) {
    try {
    } catch (err) {
      return [false, "Lỗi model", null]
    }

  }

  findAll() {
    return `This action returns all staffServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staffService`;
  }

  update(id: number, updateStaffServiceDto: UpdateStaffServiceDto) {
    return `This action updates a #${id} staffService`;
  }

  remove(id: number) {
    return `This action removes a #${id} staffService`;
  }
}
