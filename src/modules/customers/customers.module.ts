import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AppointmentDetail } from '../appointment-details/entities/appointment-detail.entity';
import { VoucherHistory } from '../voucher-history/entities/voucher-history.entity';
import { Voucher } from '../vouchers/entities/voucher.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Customer,Appointment,AppointmentDetail,VoucherHistory,Voucher])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
