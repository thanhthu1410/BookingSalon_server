import { async } from 'rxjs';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Response } from "express"

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
  constructor(private readonly vouchersService: VouchersService) {}
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
     if(!voucherRes) return false
      return res.status(voucherRes ? 200 : 213).json(voucherRes)
  }
  @Get()
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.vouchersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVoucherDto: UpdateVoucherDto) {
    console.log("id",id);
    
    return this.vouchersService.update(id,updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(+id);
  }
}
