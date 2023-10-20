import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentStatus } from "../appointment.enum";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { AppointmentDetail } from "src/modules/appointment-details/entities/appointment-detail.entity";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: string

    @Column()
    time: string

    @Column({default:  Date.now()})
    createdAt: string

    @Column({default:  Date.now()})
    updatedAt: string

    @Column({default: false})
    IsDelete: boolean

    @Column({default: "busy"})
    reasonDelete: string

    @Column({default:0})
    total: number

    @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
    status: AppointmentStatus

    @Column()
    customerId: number
    @ManyToOne(() => Customer, (customer) => customer.appointments)
    @JoinColumn({ name: 'customerId' })
    customer: Customer

    @OneToMany(() => AppointmentDetail, (appointmentDetail) => appointmentDetail.appointment)
    appointmentDetails: AppointmentDetail[]
}
