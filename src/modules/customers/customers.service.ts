
import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AppointmentDetail } from '../appointment-details/entities/appointment-detail.entity';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { CreateAppointmentDetailDto } from '../appointment-details/dto/create-appointment-detail.dto';
import { VoucherHistory } from '../voucher-history/entities/voucher-history.entity';
import { CreateVoucherHistoryDto } from '../voucher-history/dto/create-voucher-history.dto';
import { Voucher } from '../vouchers/entities/voucher.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customersSer: Repository<Customer>,
    @InjectRepository(Appointment) private appoimentSer: Repository<Appointment>,
    @InjectRepository(AppointmentDetail) private appoimentDetailSer: Repository<AppointmentDetail>,
    @InjectRepository(VoucherHistory) private voucherHistorySer: Repository<VoucherHistory>,
    @InjectRepository(Voucher) private voucherSer: Repository<Voucher>
  ) {}
  async create(createCustomerDto: CreateCustomerDto, createAppointmentDto: any, createAppointmentDetailDto: CreateAppointmentDetailDto[],voucherHistoryDto?: CreateVoucherHistoryDto, useVoucher?:any) {
 
    try {
      let customerRes ;
      const findCustomer = await this.customersSer.findOne({
        where:{
          email: createCustomerDto.email
        }
      })
      if(!findCustomer) {
         customerRes = await this.customersSer.save(createCustomerDto);
        console.log("customerRes", customerRes);
        if (!customerRes) return {
          status: false,
          message: "Error al crear el cliente"
        }
        if (customerRes) {
          let formartAppointment = {
            ...createAppointmentDto,
            customerId: customerRes.id
          }
          let appointmentRes = await this.appoimentSer.save(formartAppointment)
          console.log("appointmentRes", appointmentRes);
          if (!appointmentRes) throw new Error('Error al crear cita')
  
          if (appointmentRes) {
            // chekck xem co voucher hay khong !
            if(voucherHistoryDto){
              console.log("voucherHistoryDto",voucherHistoryDto);
              const formartVoucherHistory = {
                ...voucherHistoryDto,
                appointmentId: Number(appointmentRes.id),
                customerId: Number(customerRes.id)
              }
              let resultVoucherHistory = await this.voucherHistorySer.save(formartVoucherHistory)
              console.log("resultVoucherHistory",resultVoucherHistory);
              if(resultVoucherHistory){
                let updateVoucherUsed = {
                  ...useVoucher,
                  status: true
                }
                let updatedVoucher = this.voucherSer.merge(useVoucher,updateVoucherUsed);
                let resultUpdateVoucher = await this.voucherSer.save(updatedVoucher) 
              }
            }
            for (let i in createAppointmentDetailDto) {
              createAppointmentDetailDto[i] = {
                ...createAppointmentDetailDto[i],
                appointmentId: appointmentRes.id
              }
            }
            let resultAppomentDetailRes = await Promise.all(createAppointmentDetailDto.map(async(detail) => await this.appoimentDetailSer.save(detail)))
  
            return {
              status: true,
              message: "create booking successfull ",
              customer: customerRes,
              appoiment: appointmentRes,
              details: resultAppomentDetailRes
         
            }
          }
          
        }
      }else{
        let formartAppointment = {
          ...createAppointmentDto,
          customerId: findCustomer.id
        }
        let appointmentRes = await this.appoimentSer.save(formartAppointment)
        console.log("appointmentRes", appointmentRes);
        if (!appointmentRes) throw new Error('Error al crear cita')

        if (appointmentRes) {
          // chekck xem co voucher hay khong !
          if(voucherHistoryDto){
            console.log("voucherHistoryDto",voucherHistoryDto);
            const formartVoucherHistory = {
              ...voucherHistoryDto,
              appointmentId: Number(appointmentRes.id),
              customerId: Number(customerRes.id)
            }
            let resultVoucherHistory = await this.voucherHistorySer.save(formartVoucherHistory)
            console.log("resultVoucherHistory",resultVoucherHistory);
            if(resultVoucherHistory){
              let updateVoucherUsed = {
                ...useVoucher,
                status: true
              }
              let updatedVoucher = this.voucherSer.merge(useVoucher,updateVoucherUsed);
              let resultUpdateVoucher = await this.voucherSer.save(updatedVoucher) 
            }
          }
          for (let i in createAppointmentDetailDto) {
            createAppointmentDetailDto[i] = {
              ...createAppointmentDetailDto[i],
              appointmentId: appointmentRes.id
            }
          }
          let resultAppomentDetailRes = await Promise.all(createAppointmentDetailDto.map(async(detail) => await this.appoimentDetailSer.save(detail)))

          return {
            status: true,
            message: "create booking successfull ",
            customer: customerRes,
            appoiment: appointmentRes,
            details: resultAppomentDetailRes
       
          }
        }
        
      

      }
     

    
      return {
        status: true,
        message: "create booking okey",
        

      }
    
    } catch (err) {
      console.log("err", err);

      return {
        status: false,
        message: "faild"
      }
    }

  }

  findAll() {
    return `This action returns all customers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
