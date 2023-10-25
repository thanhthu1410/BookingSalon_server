import { Injectable, Logger } from '@nestjs/common';
import { CreateCronjobDto } from './dto/create-cronjob.dto';
import { UpdateCronjobDto } from './dto/update-cronjob.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService, templates } from '../mail/mail.service';
import { AppointmentsService } from '../appointments/appointments.service';
import * as fs from 'fs';
import * as ejs from 'ejs';
@Injectable()
export class CronjobsService {
  constructor(private readonly mail: MailService, private readonly appointmentsService: AppointmentsService){}
  private readonly logger = new Logger(CronjobsService.name);
  //CronExpression.EVERY_30_SECONDS
  //"50 * * * * *"
  @Cron("1 1 * * * *") 
  async handleCron() {
    //Mục đích: gửi email trước 1 tiếng cho các lịch hẹn sắp đến giờ thực hiện dịch vụ
    //Mục tiêu:Lọc ra những lịch hiện còn 1 tiếng nữa  tới giờ thực hiện dịch vụ và gửi qua email của của người đăng kí lịch hẹn đó
    //Sử dụng cron của nest js theo thời gian đã được thiết lập sẽ chạy hàm này
    //Lọc ra những lịch hẹn đúng điều kiện và gửi email đến để nhắc

    // Bước 1: Kéo dữ liệu lịch hẹn về 
    const apm = await  this.appointmentsService.findAll() 
    //Bước 2: Lọc 
    for(let i in apm){
      const [hour, minute] = apm[i].time.split(':');
      const [day, month, year] = apm[i].date.split('/');
      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:00`;
      const timestamp = new Date(formattedDate).getTime();
     if(timestamp-Date.now()>0&&timestamp-Date.now()<(1000*60*60)&&apm[i].status=="ACCEPTED"){ 
      console.log("alll");
      
    //Bước 3: gửi email đến những lịch đủ điều kiện
          const ejsTemplate = fs.readFileSync('reminderTemplate.ejs', 'utf8');
          const templateData = {
            customerName:apm[i].customer.fullName,
            date:apm[i].date,
            time:apm[i].time,
            appointmentDetail: apm[i].appointmentDetails,
            total:apm[i].appointmentDetails.reduce((acc, detail) => acc + detail.price, 0)
          };
          const compiledHtml = ejs.render(ejsTemplate, templateData);
            this.mail.sendMail({
            to: `${apm[i].customer.email}`,
            subject: "Rasm Salon Reminder Email",
            html: compiledHtml
    });
     }
    }
  }
  create(createCronjobDto: CreateCronjobDto) {
    return 'This action adds a new cronjob';
  }

  findAll() {
    return `This action returns all cronjobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cronjob`;
  }

  update(id: number, updateCronjobDto: UpdateCronjobDto) {
    return `This action updates a #${id} cronjob`;
  }

  remove(id: number) {
    return `This action removes a #${id} cronjob`;
  }
}
