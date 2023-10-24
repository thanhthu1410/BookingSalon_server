import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { CronjobsController } from './cronjobs.controller';
import { MailService } from '../mail/mail.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  controllers: [CronjobsController],
  providers: [CronjobsService, MailService, AppointmentsService],
})
export class CronjobsModule {}
