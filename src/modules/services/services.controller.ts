import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UploadedFile, UseInterceptors, HttpStatus, HttpException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from 'src/firebase';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Res() res: Response, @Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const data = JSON.parse(body.service)
    let avatar = await uploadFileToStorage(file, "service", file.buffer)
    const newData = {
      ...data,
      avatar: avatar
    }

    try {
      let serviceRes = await this.servicesService.create(newData)
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      console.log("err", err);
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);

    }
  }


  @Get()
  async findAll(@Res() res: Response) {
    try {
      let serviceRes = await this.servicesService.findAll()
      res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(@Res() res: Response, @Req() req: Request, @Param('id') id: number, @Body() body: any, updateServiceDto: UpdateServiceDto, @UploadedFile() file: Express.Multer.File) {
    // console.log("updatedata", body.services);
    updateServiceDto = JSON.parse(body.services)
    try {
      if (file) {
        let url = await uploadFileToStorage(file, "service", file.buffer)
        updateServiceDto.avatar = url;
      }
      let serviceRes = await this.servicesService.update(id, updateServiceDto);
      if (serviceRes) {
        return res.status(HttpStatus.OK).json(serviceRes);
      }
    } catch (error) {
      console.error('Error in image upload:', error);
      throw new HttpException('Loi Controller', HttpStatus.BAD_REQUEST);
    }

  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
