import { Service } from "src/modules/services/entities/service.entity";
import { Staff } from "src/modules/staffs/entities/staff.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StaffService {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: String(Date.now())
    })
    createdAt: string

    @Column({
        default: String(Date.now())
    })
    updatedAt: string

    @Column({ default: false })
    IsDelete: boolean

    @Column({ nullable: false })
    serviceId: string

    @Column({ nullable: false })
    staffId: string

    @ManyToOne(() => Staff, (staff) => staff.staffServices)
    @JoinColumn({ name: "staffId" })
    staff: Staff

    @ManyToOne(() => Service, (service) => service.staffServices)
    @JoinColumn({ name: "serviceId" })
    service: Service
}
