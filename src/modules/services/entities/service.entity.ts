import { AppointmentDetail } from "src/modules/appointment-details/entities/appointment-detail.entity";
import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { StaffService } from "src/modules/staff-services/entities/staff-service.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    desc: string

    @Column()
    price: number

    @Column()
    duration: number

    @OneToMany(() => AppointmentDetail, (appointmentDetail) => appointmentDetail.service)
    appointmentDetails: AppointmentDetail[]

    @OneToMany(() => StaffService, (staffService) => staffService.service)
    staffServices: StaffService[]

}
