import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {Response} from "express"

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
 async create(@Body() body: any, createCustomerDto: CreateCustomerDto, @Res() res: Response) {
 
    const customerData = {
      fullName: body?.customer?.fullName,
      email: body?.customer?.email,
      phoneNumber: body?.customer?.phoneNumber,
    };
   
    // tinh total ;
    let totalNotVoucherBefore: number ;
    let totalNotVoucherAfter=  totalNotVoucherBefore = body?.details?.reduce((acc: number, appointment: any) => {
      const appointmentCost = appointment.price * appointment.slot;
      return acc + appointmentCost;
    }, 0);
     // tinh tien khi khong co voucher
    if(!body.voucher){
      totalNotVoucherBefore = body?.details?.reduce((acc, appointment) => {
        const appointmentCost = appointment.price * appointment.slot;
        return acc + appointmentCost;
      }, 0);
    }else{
       // tinh tien khi co voucher
        // tinh tien khi co voucher vs type cash
      if(body.voucher.discountType == "cash" ){
        totalNotVoucherBefore = totalNotVoucherAfter - (Number(body?.voucher?.value))
         // tinh tien khi co voucher vs type cash & total < value discount
        if(totalNotVoucherBefore < 0) {
           totalNotVoucherBefore = 0
        }
         // tinh tien khi co voucher vs type percent
      }else if(body.voucher.discountType == "percent" ){

         totalNotVoucherBefore = totalNotVoucherAfter - (totalNotVoucherAfter * (Number(body?.voucher?.value)) * 0.01)
      }
    }
    const appointmentData ={
      date:  body?.appointment?.date,
      time:  body?.appointment?.time,
      total: body?.voucher ? totalNotVoucherBefore : totalNotVoucherAfter 

    };
    const formatAppoimentDetail = body?.details;
    let voucherHistoryData:any;
    if(body?.voucher) {
      voucherHistoryData = {
        voucherId: body?.voucher?.id
      }
    }
    let result = await this.customersService.create(customerData, appointmentData,formatAppoimentDetail,voucherHistoryData,body?.voucher )
    return res.status(result.status ? 200 :213).json(result.message)
  }
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
