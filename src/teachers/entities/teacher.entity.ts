// import { User } from "src/users/entities/user.entity";
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("teachers")
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 20, unique: true })
    employee_code: string;

    @Column({ type: "varchar", length: 120 })
    subject: string;

    @Column({ type: "varchar", length: 150, unique: true })
    qualification: string;

    @Column({ type: "int", default: 0 })
    experience: number;

    @Column({ name: "user_id" })
    user_id: number;

    @OneToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
}