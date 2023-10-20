import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { StaffService } from '../staff-services/entities/staff-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, StaffService])],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule { }
