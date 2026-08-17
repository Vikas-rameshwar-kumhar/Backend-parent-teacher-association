import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { 
  UserRole, 
  UserStatus 
} from '../users_enum/users.enum';
import { Exclude } from 'class-transformer';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  role: UserRole;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}





// no password show    : done 
// patch should there  : done 
// enum diff folder    : done
// testcase in servicesVersion.spec.ts : done only for users later do it for others 



// teacher : error code 500 : internal server issue ==> change it to ==> email must be different 




// when password changes then old token is still woking (old password's token) for authorize
// fix it or it will valid for 1d ?

