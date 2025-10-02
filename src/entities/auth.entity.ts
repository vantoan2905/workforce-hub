import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: true })
    username: string;

    @Column()
    password: string
    
    @Column({ unique: true })
    email: string
    
    @Column()
    firstName: string
    
    @Column()
    lastName: string
    
    @Column({ nullable: true })
    phoneNumber: string
    
    @Column({ default: 'user' })
    role: string
    
    @Column({ default: true })
    isActive: boolean
    
    @Column({ nullable: true })
    createdBy: string
    @Column({ nullable: true })
    updatedBy: string
}
