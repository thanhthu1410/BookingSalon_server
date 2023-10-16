import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentStatus } from "../appointment.enum";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { AppointmentDetail } from "src/modules/appointment-details/entities/appointment-detail.entity";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: Date

    @Column()
    time: Date

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column()
    IsDelete: boolean

    @Column()
    reasonDelete: string

    @Column()
    total: number

    @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
    status: AppointmentStatus

    @ManyToOne(() => Customer, (customer) => customer.appointments)
    @JoinColumn({ name: 'customerId' })
    customer: Customer

    @OneToMany(() => AppointmentDetail, (appointmentDetail) => appointmentDetail.appointment)
    appointmentDetails: AppointmentDetail[]
}
