import { async } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { Repository } from 'typeorm';


@Injectable()
export class VouchersService {
  constructor(@InjectRepository(Voucher) private voucherSer: Repository<Voucher>) { }
  async create(data: CreateVoucherDto) {
    console.log("data", data);
    try {
      let result = await this.voucherSer.save(data)
      return {
        status: true,
        message: "create okey ",
        data: result
      }
    } catch {
      return {
        status: false,
        message: "create failed ",
        data: null
      }
    }
  }

  async findAll() {
    try {
      let result = await this.voucherSer.find({
        where: {
          IsDelete: false
        }
      })
      if (!result) return false
      return { status: true, message: "Get Vouchers Successfully !", data: result }
    } catch {
      return {
        status: false,
        message: "Get Vouchers Failed",
        data: null
      }
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.voucherSer.findOne({
        where: {
          id,
        }
      })
      if (!result) return {
        status: false,
        data: null,
        message: 'Not Found'
      }
      return {
        status: true,
        message: 'get one voucher successfully',
        data: result
      }
    } catch {

    }

  }

  async update(id: number) {
    try {
      const oldData = (await this.findOne(Number(id))).data
      console.log("oldData", oldData);
      const newData = {
        ...oldData,
        IsDelete: true
      }
      console.log("newData", newData);
      const resutl = await this.voucherSer.update(oldData, newData)
      if (!resutl) return false
      return {
        status: true,
        message: "Delete Successfull ",
        data: resutl
      }
    } catch {
      return {
        status: false,
        message: "Delete Faild ",
        data: null
      }
    }
    
  async update(id: number,updateVoucherDto: UpdateVoucherDto) {
   try{
    const oldData = await this.voucherSer.findOne({
      where:{
        id
      }
    })
    console.log("oldData",oldData);
    console.log("updateVoucherDto",updateVoucherDto);
    
    const resutl = this.voucherSer.merge(oldData, updateVoucherDto)
    const updateData = await this.voucherSer.save(resutl)
   if(!resutl) return false
   return {
    status: true,
    message: "Delete Successfull ",
    data: updateData
   }
   }catch{
    return {
      status: false,
      message: "Delete Faild ",
      data: null
     }
   }

  }
  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
