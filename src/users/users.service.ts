import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    password: string;
    birthdate: string;
    role?: Role;
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        birthdate: new Date(data.birthdate),
        role: data.role ?? Role.USER,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        birthdate: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateRole(userId: number, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        birthdate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }




}
