import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';


@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() body: any, @Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    const data = JSON.parse(body.staff)
  }

  @Get()
  findAll() {
    return this.staffsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffsService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffsService.remove(+id);
  }
}
