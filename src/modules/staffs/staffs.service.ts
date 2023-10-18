import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffsService {

  constructor(
    @InjectRepository(Staff)
    private StaffRepository: Repository<Staff>,
  ) { }


  async create(createStaffDto: CreateStaffDto) {
    try {
      let staff = await this.StaffRepository.save(createStaffDto)
      if (!staff) {
        throw new Error('Error')
      }
      let newStaff = await this.StaffRepository.findOne({
        where: {
          id: staff.id
        },
        relations: {
          staffServices: true,
          appointmentDetails: true
        }
      })
      if (!newStaff) {
        throw new HttpException(`service not found`, HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Servicio Creado',
        data: staff
      }
    } catch (err) {
      console.log("err", err);
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }

  }

  findAll() {
    return `This action returns all staffs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
