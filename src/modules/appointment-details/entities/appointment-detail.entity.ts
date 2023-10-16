import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Service } from "src/modules/services/entities/service.entity";
import { Staff } from "src/modules/staffs/entities/staff.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AppointmentDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    price: number

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column()
    IsDelete: boolean

    @ManyToOne(() => Appointment, (appointment) => appointment.appointmentDetails)
    @JoinColumn({ name: "appointmentId" })
    appointment: Appointment

    @ManyToOne(() => Service, (service) => service.appointmentDetails)
    @JoinColumn({ name: "serviceId" })
    service: Service

    @ManyToOne(() => Staff, (staff) => staff.appointmentDetails)
    @JoinColumn({ name: "staffId" })
    staff: Staff
}
