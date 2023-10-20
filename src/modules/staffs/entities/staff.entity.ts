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
    birthDay: string

    @Column()
    phoneNumber: string

    @Column()
    experience: string

    @Column({ default: true })
    status: boolean

    @Column()
    desc: string

<<<<<<<< <Temporary merge branch 1
@Column({ default: Date.now() })
createdAt: string

@Column({ default: Date.now() })
=========
    @Column({ default: Date.now() })
    createdAt: string

    @Column({ default: Date.now() })
>>>>>>>>> Temporary merge branch 2
    updatedAt: string

    @Column({ default: false })
    IsDelete: boolean

    @OneToMany(() => AppointmentDetail, (appointmentDetail) => appointmentDetail.staff)
    appointmentDetails: AppointmentDetail[]

    @OneToMany(() => StaffService, (staffService) => staffService.staff)
    staffServices: StaffService[]
}