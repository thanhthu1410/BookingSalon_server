import { async } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { Repository } from 'typeorm';


@Injectable()
export class VouchersService {
  constructor(@InjectRepository(Voucher) private voucherSer : Repository<Voucher>){}
  async create(data: CreateVoucherDto) {
  console.log("data",data);
  try{
     let result = await this.voucherSer.save(data)
      return {
        status: true,
        message: "create okey ",
        data: result
      }
  }catch{
    return {
      status: false,
      message: "create failed ",
      data: null
    }
  }
  }

  findAll() {
    return `This action returns all vouchers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voucher`;
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
