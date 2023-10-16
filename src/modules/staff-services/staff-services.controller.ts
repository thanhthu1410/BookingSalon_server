import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffServicesService } from './staff-services.service';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';

@Controller('staff-services')
export class StaffServicesController {
  constructor(private readonly staffServicesService: StaffServicesService) {}

  @Post()
  create(@Body() createStaffServiceDto: CreateStaffServiceDto) {
    return this.staffServicesService.create(createStaffServiceDto);
  }

  @Get()
  findAll() {
    return this.staffServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffServiceDto: UpdateStaffServiceDto) {
    return this.staffServicesService.update(+id, updateStaffServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffServicesService.remove(+id);
  }
}
