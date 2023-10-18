import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffServiceDto } from '../staff-services/dto/create-staff-service.dto';
import { StaffService } from '../staff-services/entities/staff-service.entity';

@Injectable()
export class StaffsService {

  constructor(
    @InjectRepository(Staff) private StaffRepository: Repository<Staff>,
    // @InjectRepository(StaffService) private StaffServiceRepository: Repository<StaffService>
  ) { }


  async create(createStaffDto: CreateStaffDto,
    //serviceList: CreateStaffServiceDto
  ) {
    try {
      console.log("da vao");
      const staff = await this.StaffRepository.save(createStaffDto)
      // const newserviceList = await Promise.all(serviceList.serviceList?.map(async (staffService) => {
      //   return await this.StaffRepository.save({
      //     staffService,
      //     productOptionsId: staff.id
      //   })
      // }))


      if (!staff) {
        console.log("loi chuwa vao");

        throw new Error('Error')
      }
      //let staffService = await this.staffServiceRepository.save(serviceList)
      let newStaff = await this.StaffRepository.findOne({
        where: {
          id: staff.id
        },
        relations: {
          staffServices: true,
          appointmentDetails: true
        }
      })
      console.log("newStaff", newStaff);

      if (!newStaff) {
        throw new HttpException(`staff not found`, HttpStatus.NOT_FOUND);
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
