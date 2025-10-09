
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BlackList {
    @PrimaryGeneratedColumn()
    blackListId: number;
    @Column()
    employeeId: number;
    @Column()
    token: string;
    @Column()
    createdAt: Date

}