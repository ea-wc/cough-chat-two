import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  private async profileOrThrow(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }
    return profile;
  }

  async getMe(userId: string) {
    return this.profileOrThrow(userId);
  }

  async updateMe(userId: string, dto: UpdateDoctorDto) {
    await this.profileOrThrow(userId);
    const { firstName, lastName, bio, specialization } = dto;
    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(bio !== undefined && { bio }),
        ...(specialization !== undefined && { specialization }),
      },
    });
  }

  async listAvailability(userId: string) {
    const profile = await this.profileOrThrow(userId);
    return this.prisma.availability.findMany({
      where: { doctorId: profile.id },
      orderBy: { startAt: 'asc' },
    });
  }

  async createAvailability(userId: string, dto: CreateAvailabilityDto) {
    const profile = await this.profileOrThrow(userId);
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);
    if (startAt >= endAt) {
      throw new BadRequestException('endAt must be after startAt');
    }
    const overlap = await this.prisma.availability.findFirst({
      where: {
        doctorId: profile.id,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });
    if (overlap) {
      throw new BadRequestException('Slot overlaps an existing availability');
    }
    return this.prisma.availability.create({
      data: { doctorId: profile.id, startAt, endAt },
    });
  }

  async deleteAvailability(userId: string, id: string) {
    const profile = await this.profileOrThrow(userId);
    const slot = await this.prisma.availability.findFirst({
      where: { id, doctorId: profile.id },
    });
    if (!slot) {
      throw new NotFoundException('Availability slot not found');
    }
    return this.prisma.availability.delete({ where: { id } });
  }

  async myAppointments(userId: string) {
    return this.prisma.appointment.findMany({
      where: { doctorId: userId },
      orderBy: { startAt: 'asc' },
      include: {
        patient: { include: { patientProfile: true } },
        consultation: true,
      },
    });
  }

  // --- Discovery (patient-facing) ---

  async listDoctors() {
    return this.prisma.doctorProfile.findMany({
      where: { approvalStatus: 'APPROVED' },
      include: {
        user: { select: { email: true } },
        availabilities: { where: { status: 'AVAILABLE' } },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async searchDoctors(query?: string) {
    const q = (query ?? '').trim();
    const where = q
      ? {
          approvalStatus: 'APPROVED' as const,
          OR: [
            { firstName: { contains: q, mode: 'insensitive' as const } },
            { lastName: { contains: q, mode: 'insensitive' as const } },
            { specialization: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : { approvalStatus: 'APPROVED' as const };

    return this.prisma.doctorProfile.findMany({
      where,
      include: {
        user: { select: { email: true } },
        availabilities: { where: { status: 'AVAILABLE' } },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async getDoctor(id: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        availabilities: {
          where: { status: 'AVAILABLE', startAt: { gt: new Date() } },
          orderBy: { startAt: 'asc' },
        },
      },
    });
    if (!doctor || doctor.approvalStatus !== 'APPROVED') {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }
}
