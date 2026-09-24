import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentStatus, SlotStatus, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { ReviewDoctorDto, UpdateUserStatusDto } from './dto/admin.dto.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private audit(adminId: string, action: string, affectedRecord: string, reason?: string) {
    return this.prisma.auditLog.create({
      data: { adminId, action, affectedRecord, reason },
    });
  }

  async searchUsers(query?: string) {
    const q = (query ?? '').trim();
    return this.prisma.user.findMany({
      where: q
        ? { email: { contains: q, mode: 'insensitive' } }
        : undefined,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        patientProfile: true,
        doctorProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserStatus(adminId: string, userId: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status: dto.status as UserStatus },
      select: { id: true, email: true, role: true, status: true },
    });
    await this.audit(adminId, 'UPDATE_USER_STATUS', `user:${userId} -> ${dto.status}`, dto.reason);
    return updated;
  }

  async listDoctors() {
    return this.prisma.doctorProfile.findMany({
      include: { user: { select: { email: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewDoctor(adminId: string, doctorId: string, dto: ReviewDoctorDto) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { id: doctorId } });
    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }
    const updated = await this.prisma.doctorProfile.update({
      where: { id: doctorId },
      data: {
        approvalStatus: dto.approvalStatus,
        ...(dto.specialization !== undefined && { specialization: dto.specialization }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
      },
    });
    await this.audit(adminId, 'REVIEW_DOCTOR', `doctor:${doctorId} -> ${dto.approvalStatus}`);
    return updated;
  }

  async listAppointments() {
    return this.prisma.appointment.findMany({
      include: {
        patient: { include: { patientProfile: true } },
        doctor: { include: { doctorProfile: true } },
        consultation: true,
      },
      orderBy: { startAt: 'desc' },
    });
  }

  async cancelAppointment(adminId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const updated = await this.prisma.$transaction(async (tx) => {
      if (appointment.availabilityId) {
        await tx.availability.update({
          where: { id: appointment.availabilityId },
          data: { status: SlotStatus.AVAILABLE },
        });
      }
      return tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CANCELLED },
      });
    });
    await this.audit(adminId, 'CANCEL_APPOINTMENT', `appointment:${appointmentId}`);
    return updated;
  }

  async dashboard() {
    const [patients, doctors, admins, appointments, consultations] = await Promise.all([
      this.prisma.user.count({ where: { role: 'PATIENT' } }),
      this.prisma.user.count({ where: { role: 'DOCTOR' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.appointment.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.consultation.groupBy({
        by: ['state'],
        _count: { state: true },
      }),
    ]);

    return {
      users: { patients, doctors, admins, total: patients + doctors + admins },
      appointments: Object.fromEntries(appointments.map((a) => [a.status, a._count.status])),
      consultations: Object.fromEntries(consultations.map((c) => [c.state, c._count.state])),
    };
  }

  async auditLog() {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      include: { admin: { select: { email: true } } },
      take: 200,
    });
  }
}
