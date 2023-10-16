import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Time {
    @PrimaryColumn()
    id: number

    @Column()
    startTime: number

    @Column()
    endTime: number

    @Column()
    duration: number
}
