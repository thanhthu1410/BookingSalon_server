import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column()
    IsDelete: boolean
}
