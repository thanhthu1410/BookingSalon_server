import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination-service.dto';

@Injectable()
export class ServicesService {

  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) { }

  async create(createServiceDto: CreateServiceDto) {
    try {
      let service = await this.serviceRepository.save(createServiceDto)
      if (!service) {
        throw new Error('Error')
      }
      let newService = await this.serviceRepository.findOne({
        where: {
          id: service.id
        },
        relations: {
          staffServices: true,
          appointmentDetails: true
        }
      })
      if (!newService) {
        throw new HttpException(`service not found`, HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Servicio Creado',
        data: service
      }
    } catch (err) {
      console.log("err", err);
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      let services = await this.serviceRepository.find({
        where: {
          isDelete: false
        },

        relations: {
          staffServices: true,
          appointmentDetails: true
        },
        skip: pagination.skip,
        take: pagination.take
      })

      let countItem = (await this.serviceRepository.find()).length
      let maxPage = Math.ceil(countItem / pagination.take)
      return {
        message: 'successful',
        data: services,
        maxPage
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      let data = await this.serviceRepository.findOne({ where: { id } })
      console.log("data", data);

      if (!data) return false
      // console.log("updatedata", updateServiceDto);

      let newData = this.serviceRepository.merge(data, updateServiceDto
      )
      let result = await this.serviceRepository.save(newData)
      // console.log("result", result);

      return {
        status: true,
        message: "Update service Successfully!",
        data: result
      }
    } catch (err) {
      return {
        status: false,
        message: "Update Faild ",
        data: null
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  async remove(id: number) {
    try {
      let oldData = await this.serviceRepository.findOne({ where: { id } })


      let newData = {
        ...oldData,
        isDelete: true
      }


      const result = this.serviceRepository.merge(oldData, newData)

      const updateResult = await this.serviceRepository.save(result)

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

  async searchByName(name: string) {
    try {
      let service = await this.serviceRepository.find({
        where: {
          name: ILike(`%${name}%`),
        },
        relations: {
          staffServices: true,
          appointmentDetails: true
        }
      }
      );
      return {
        data: service,
        message: "Get service successfully"
      }
    } catch (err) {
      console.log("err111111:", err)
      throw new HttpException('Loi Model', HttpStatus.BAD_REQUEST);
    }
  }
}

