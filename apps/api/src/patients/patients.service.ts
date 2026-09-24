import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getProfileOrThrow(userId: string) {
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Patient profile not found');
    }
    return profile;
  }

  async getMe(userId: string) {
    return this.getProfileOrThrow(userId);
  }

  async updateMe(userId: string, dto: UpdatePatientDto) {
    await this.getProfileOrThrow(userId);
    const data = {
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName !== undefined && { lastName: dto.lastName }),
      ...(dto.birthday !== undefined && { birthday: new Date(dto.birthday) }),
      ...(dto.weightKg !== undefined && { weightKg: dto.weightKg }),
      ...(dto.heightCm !== undefined && { heightCm: dto.heightCm }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.medicalHistory !== undefined && { medicalHistory: dto.medicalHistory }),
    };
    return this.prisma.patientProfile.update({ where: { userId }, data });
  }

  async myAppointments(userId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId: userId },
      orderBy: { startAt: 'asc' },
      include: {
        doctor: { include: { doctorProfile: true } },
        consultation: true,
      },
    });
  }

  async myPrescriptions(userId: string) {
    return this.prisma.prescription.findMany({
      where: { patientId: userId },
      orderBy: { issuedAt: 'desc' },
      include: {
        doctor: { include: { doctorProfile: true } },
        consultation: true,
      },
    });
  }
}
