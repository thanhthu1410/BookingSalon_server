import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './modules/customers/customers.module';
import { ServicesModule } from './modules/services/services.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TimeModule } from './modules/time/time.module';
import { AppointmentDetailsModule } from './modules/appointment-details/appointment-details.module';
import { StaffsModule } from './modules/staffs/staffs.module';
import { StaffServicesModule } from './modules/staff-services/staff-services.module';
import { UsersModule } from './modules/users/users.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    CustomersModule, ServicesModule, AppointmentsModule, TimeModule, AppointmentDetailsModule, StaffsModule, StaffServicesModule, UsersModule, VouchersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
