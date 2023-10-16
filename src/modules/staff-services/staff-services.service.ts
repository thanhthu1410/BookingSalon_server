import { Injectable } from '@nestjs/common';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';

@Injectable()
export class StaffServicesService {
  create(createStaffServiceDto: CreateStaffServiceDto) {
    return 'This action adds a new staffService';
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
