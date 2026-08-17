import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Parent } from './entities/parent.entity';
import { User } from '../users/entities/user.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { UserRole } from 'src/users/users_enum/users.enum';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateParentDto): Promise<Parent> {
    const existingUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: dto.email } });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    return this.dataSource.transaction(async (manager) => {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: UserRole.PARENT,
      });
      const savedUser = await manager.save(user);

      const parent = manager.create(Parent, {
        occupation: dto.occupation,
        address: dto.address,
        relation: dto.relation,
        user_id: savedUser.id,
      });

      return manager.save(parent);
    });
  }

  async findAll(): Promise<Parent[]> {
    return this.parentRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Parent> {
    const parent = await this.parentRepository.findOne({ where: { id } });
    if (!parent) {
      throw new NotFoundException(`Parent with id ${id} not found`);
    }
    return parent;
  }

  async update(id: number, dto: UpdateParentDto): Promise<Parent> {
    const parent = await this.findOne(id);

    const { name, email, phone, password, ...parentFields } = dto;

    return this.dataSource.transaction(async (manager) => {
      if (name || email || phone || password) {
        const userUpdate: Partial<User> = {};
        if (name) userUpdate.name = name;
        if (email) userUpdate.email = email;
        if (phone) userUpdate.phone = phone;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);

        await manager.update(User, parent.user_id, userUpdate);
      }

      if (Object.keys(parentFields).length > 0) {
        await manager.update(Parent, id, parentFields);
      }

      const updatedParent = await manager.findOne(Parent, { where: { id } });

      if (!updatedParent) {
        throw new NotFoundException(`Parent with id ${id} not found`);
      }

      return updatedParent;
    });
  }

  async remove(id: number): Promise<void> {
    const parent = await this.findOne(id);
    await this.parentRepository.remove(parent);
  }
}