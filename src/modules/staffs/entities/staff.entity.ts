import { AppointmentDetail } from "src/modules/appointment-details/entities/appointment-detail.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StaffStatus } from "../staff.enum";
import { StaffService } from "src/modules/staff-services/entities/staff-service.entity";

@Entity()
export class Staff {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    avatar: string

    @Column()
    birthDay: Date

    @Column()
    phoneNumber: string

    @Column()
    experience: string

    @Column({ type: 'enum', enum: StaffStatus, default: StaffStatus.ACTIVE })
    status: StaffStatus

    @Column()
    desc: string

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column()
    IsDelete: boolean

    @OneToMany(() => AppointmentDetail, (appointmentDetail) => appointmentDetail.staff)
    appointmentDetails: AppointmentDetail[]

    @OneToMany(() => StaffService, (staffService) => staffService.staff)
    staffServices: StaffService[]
}
