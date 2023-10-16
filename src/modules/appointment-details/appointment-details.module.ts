import { Module } from '@nestjs/common';
import { AppointmentDetailsService } from './appointment-details.service';
import { AppointmentDetailsController } from './appointment-details.controller';

@Module({
  controllers: [AppointmentDetailsController],
  providers: [AppointmentDetailsService],
})
export class AppointmentDetailsModule {}
