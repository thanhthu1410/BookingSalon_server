import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpException, HttpStatus, Req } from '@nestjs/common';
import { StaffServicesService } from './staff-services.service';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';
import { Response } from 'express'

@Controller('staff-services')
export class StaffServicesController {
  constructor(private readonly staffServicesService: StaffServicesService) { }

  @Post()
  async create(@Res() res: Response, @Body() createStaffServiceDto: CreateStaffServiceDto) {
    try {
      let StaffServiceRes = await this.staffServicesService.create(createStaffServiceDto)
      res.statusMessage = StaffServiceRes.message
      res.status(StaffServiceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(StaffServiceRes)
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  findAll() {
    return this.staffServicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {

      let staffServiceerviceRes = await this.staffServicesService.findOne(id)
      res.statusMessage = staffServiceerviceRes.message
      res.status(staffServiceerviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(staffServiceerviceRes.data)
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffServiceDto: UpdateStaffServiceDto) {
    return this.staffServicesService.update(+id, updateStaffServiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      let StaffServiceRes = await this.staffServicesService.remove(id)
      res.statusMessage = StaffServiceRes.message
      res.status(StaffServiceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(StaffServiceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)

    }
  }


}
