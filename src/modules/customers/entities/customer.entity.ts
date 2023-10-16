import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullName: string

    @Column()
    phoneNumber: string

    @Column()
    email: string

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column()
    IsDelete: boolean

    @Column()
    status: boolean

    @OneToMany(() => Appointment, (appointment) => appointment.customer)
    appointments: Appointment[]
}
