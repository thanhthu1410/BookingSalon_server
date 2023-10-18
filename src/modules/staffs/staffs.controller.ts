import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, HttpException, HttpStatus, Req } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { uploadFileToStorage } from 'src/firebase';


@Controller('staffs')
export class StaffsController {

  constructor(private readonly staffsService: StaffsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Res() res: Response, @Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const data = JSON.parse(body.staff)
    // console.log("body.staff:", body.staff)
    // console.log("file", file);
    let avatar = await uploadFileToStorage(file, "staff", file.buffer)
    const newData = {
      ...data,
      avatar: avatar
    }
    try {
      let staffRes = await this.staffsService.create(newData)
      //serviceList

      res.status(staffRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(staffRes)
    } catch (err) {
      console.log("error", err)
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }

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
