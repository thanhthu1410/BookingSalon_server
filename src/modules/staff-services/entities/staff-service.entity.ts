import { Service } from "src/modules/services/entities/service.entity";
import { Staff } from "src/modules/staffs/entities/staff.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StaffService {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column()
    IsDelete: boolean

    @ManyToOne(() => Staff, (staff) => staff.staffServices)
    @JoinColumn({ name: "staffId" })
    staff: Staff

    @ManyToOne(() => Service, (service) => service.staffServices)
    @JoinColumn({ name: "serviceId" })
    service: Service
}
