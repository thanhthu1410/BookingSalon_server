import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    try {
      let services = await this.serviceRepository.find({
        relations: {
          staffServices: true,
          appointmentDetails: true
        }
      })
      return {
        message: 'successful',
        data: services
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    let data = await this.serviceRepository.findOne({ where: { id } })
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
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
