import { Module } from '@nestjs/common';
import { StaffServicesService } from './staff-services.service';
import { StaffServicesController } from './staff-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './entities/staff-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffService])],
  controllers: [StaffServicesController],
  providers: [StaffServicesService],
})
export class StaffServicesModule { }
