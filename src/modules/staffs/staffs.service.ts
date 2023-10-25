import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { StaffService } from '../staff-services/entities/staff-service.entity';
import { PaginationDto } from './dto/pagination-staff.dto';


@Injectable()
export class StaffsService {

  constructor(
    @InjectRepository(Staff) private StaffRepository: Repository<Staff>,
    @InjectRepository(StaffService) private StaffServiceRepository: Repository<StaffService>
  ) { }
  async create(createStaffDto: CreateStaffDto,
    serviceList: Array<number>
  ) {
    try {

      const newstaff = await this.StaffRepository.save(createStaffDto)

      for (let service of serviceList) {
        await this.StaffServiceRepository.save({
          staffId: newstaff.id,
          serviceId: service
        })
      }

      if (!newstaff) {
        console.log("loi chuwa vao");

        throw new Error('Error')
      }
      return {
        status: true,
        message: 'Servicio Creado',
        data: newstaff
      }
    } catch (err) {
      console.log("err", err);
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }

  }

  async findAll(pagination: PaginationDto) {
    try {
      let listStaff = await this.StaffRepository.find({
        where: {
          IsDelete: false,
          staffServices: {
            service: {
              isDelete: false
            }
          }
        },
        relations: {
          staffServices: {
            service: true
          }
        },
        skip: pagination.skip,
        take: pagination.take
      })
      let countItem = (await this.StaffRepository.find()).length
      let maxPage = Math.ceil(countItem / pagination.take)
      return {
        status: true,
        message: 'successful',
        data: listStaff,
        maxPage
      }
    } catch (err) {
      console.log(" err:", err)
      return {
        status: false,
        message: 'error',
        data: null,
      }
    }
  }

  async findStaff() {
    try {
      let staffList = await this.StaffRepository.find({
        where: {
          IsDelete: false,
          staffServices: {
            service: {
              isDelete: false
            }
          }
        },
        relations: {
          staffServices: {
            staff: true,
            service: true
          },
          //appointmentDetails: true
        }

      })
      return {
        message: 'successful',
        data: staffList,
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async searchByName(name: string) {
    try {
      let staff = await this.StaffRepository.find({
        where: {
          IsDelete: false,
          name: ILike(`%${name}%`),
        },
        relations: {
          staffServices: {
            staff: true,
            service: true
          }

          //appointmentDetails: true
        }
      }
      );
      return {
        data: staff,
        message: "Get service successfully"
      }
    } catch (err) {
      console.log("err111111:", err)
      throw new HttpException('Loi Model', HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    try {
      const data = await this.StaffRepository.findOne({
        where: { id },

        relations: {
          //appointmentDetails: true,
          staffServices: {
            service: true
          },

        }
      })
      //console.log("data :", data)
      if (!data) return false

      let newData = this.StaffRepository.merge(data, updateStaffDto)
      let result = await this.StaffRepository.save(newData)
      // console.log("result:", result)
      return {
        status: true,
        message: 'update successful',
        data: result
      }
    } catch (err) {
      console.log("err service:", err)
      return {
        status: false,
        message: "Update Faild ",
        data: null
      }
    }
  }

  async remove(id: number) {
    try {
      let oldStaff = await this.StaffRepository.findOne({ where: { id } })
      let newstaff = {

        ...oldStaff,
        IsDelete: true
      }
      //  console.log("newstaff:", newstaff)
      const result = this.StaffRepository.merge(oldStaff, newstaff)
      //console.log("result:", result)

      const updateResult = await this.StaffRepository.save(result)
      // console.log("updateStaff", updateResult);

      if (updateResult) {
        return {
          status: true,
          data: updateResult,
          message: "Delete ok"
        }
      }
    } catch (err) {
      return {
        status: false,
        message: "Delete Faild ",
        data: null
      }
    }
  }
}
