import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpException, HttpStatus } from '@nestjs/common';
import { StaffServicesService } from './staff-services.service';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';
import { Response } from 'express'

@Controller('staff-services')
export class StaffServicesController {
  constructor(private readonly staffServicesService: StaffServicesService) { }

  @Post()
  async create(@Body() createStaffServiceDto: CreateStaffServiceDto, @Res() res: Response) {
    try {
      let [status, message, data] = await this.staffServicesService.create(createStaffServiceDto);
      return res.status(status ? 200 : 213).json({
        message,
        data
      })
    } catch (err) {
      console.log("err", err);
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
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
