import { async } from 'rxjs';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe, HttpStatus, HttpException, Query } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Response } from "express";
import { PaginationDto } from '../services/dto/pagination-service.dto';

function generateRandomString(length: number) {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];

  }
  return result
}


@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) { }
  @Post()
  async create(@Body() body: any, createVoucherDto: CreateVoucherDto, @Res() res: Response) {

    let arrayVoucher = [];
    for (let i = 0; i < body.quantity; i++) {
      let createVoucher = generateRandomString(6)


      let formatVoucher = {
        code: createVoucher,
        discountType: body.discountType,
        value: body.value,
        title: body.title,
        startAt: body.startAt,
        endAt: body.endAt
      }
      arrayVoucher.push(formatVoucher)
    }
    let voucherRes = await Promise.all(arrayVoucher.map(async (voucher) => await this.vouchersService.create(voucher)));
    if (!voucherRes) return false
    return res.status(voucherRes ? 200 : 213).json(voucherRes)
  }


  @Get("search")
  async finMany(@Res() res: Response, @Query("search") search: string) {
console.log("search",search);

    if (search != undefined) {
      try {
        let serviceRes = await this.vouchersService.searchByCode(search);
        res.statusMessage = serviceRes.message;
        return res.status(HttpStatus.OK).json(serviceRes)
      } catch (err) {
        throw new HttpException("loi controller", HttpStatus.BAD_REQUEST)
      }
    } else {
      try {
        let serviceRes = await this.vouchersService.findMany();
        res.statusMessage = serviceRes.message;
        return res.status(HttpStatus.OK).json(serviceRes)
      } catch (err) {
        throw new HttpException("loi controller", HttpStatus.BAD_REQUEST)
      }

    }

  }

  @Get("getvoucher")
  async getVoucher(@Res() res: Response, @Query("getvoucher") search: string) {
   
    try {
      if(this.getVoucher != undefined) {
        let serviceRes = await this.vouchersService.getVoucher(search);
        res.statusMessage = serviceRes.message;
        return res.status(serviceRes.status ? 200 : 213).json(serviceRes)
      }
     
    } catch (err) {
      throw new HttpException("loi controller", HttpStatus.BAD_REQUEST)
    }
  }
  @Get()
  async findAll(@Res() res: Response, @Query("skip", ParseIntPipe) skip: number, @Query("take", ParseIntPipe) take: number) {
    try {
      let pagination: PaginationDto = {
        skip,
        take
      }
      let voucherRes = await this.vouchersService.findAll(pagination)
      res.statusMessage = voucherRes.message
      res.status(voucherRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(voucherRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }


  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.vouchersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVoucherDto: UpdateVoucherDto) {

    return this.vouchersService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(+id);
  }
}
