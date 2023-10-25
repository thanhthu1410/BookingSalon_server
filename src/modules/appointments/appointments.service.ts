import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { AppointmentStatus } from './appointment.enum';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as pdf from 'html-pdf';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(@InjectRepository(Appointment) private appointmentRepository: Repository<Appointment> , private readonly mail: MailService){}
  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

  async findAll() {
    const res = await this.appointmentRepository.find({
      relations:{
        appointmentDetails:{
          staff: true,
          service:true
        },
        customer:true,
        
      }
    })
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  async update(id: number) {
   
    
    const res = await this.appointmentRepository.findOne({where:{id:id},
      relations:{
        appointmentDetails:{
          staff: true,
          service:true
        },
        customer:true,
        
      }})
    const resUpdate = this.appointmentRepository.merge(res,{
      status: AppointmentStatus.DONE

    })
    const resResult = await this.appointmentRepository.save(resUpdate)
    var data = {
      customerName:resResult.customer.fullName,
      date:resResult.date,
      time:resResult.time, 
      appointmentDetail: resResult.appointmentDetails,
      total:resResult.appointmentDetails.reduce((acc, detail) => acc + detail.price, 0)
    };
    
    // Đọc tệp EJS
    var ejsTemplate = fs.readFileSync('./pdf.ejs', 'utf8');
    
    // Render tệp EJS với dữ liệu
    var html = ejs.render(ejsTemplate, data);
    
    var options = { format: 'Letter' };
     
    // Tạo tệp PDF từ HTML đã được tạo ra 
    await pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
      if (err) return console.log(err);
    });

    // resResult là dữ liệu đầu vào sao khi bấm thay đổi data base thành recipt
    // sau dó lam handle gửi mail kèm pdf
     this.mail.sendMail({
      to: resResult.customer.email,
      subject: "aaa",
      html:`
      Testing Pdf Generate document, Thanks.`,
      attachments:[
          {  
              filename:'businesscard.pdf',
              contentType: 'application/pdf',
              path:"./businesscard.pdf"
          }
      ]
});
    return resResult;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
