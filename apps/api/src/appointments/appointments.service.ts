import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, SlotStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BookAppointmentDto } from './dto/book-appointment.dto.js';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async book(patientId: string, dto: BookAppointmentDto) {
    const slot = await this.prisma.availability.findUnique({
      where: { id: dto.availabilityId },
    });
    if (!slot) {
      throw new NotFoundException('Availability slot not found');
    }
    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new ConflictException('Slot is no longer available');
    }
    if (slot.startAt <= new Date()) {
      throw new BadRequestException('Slot is in the past');
    }

    // The slot's doctorId is a DoctorProfile.id; the appointment references the User.id.
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { id: slot.doctorId },
    });
    if (!doctorProfile) {
      throw new NotFoundException('Doctor not found');
    }
    const doctorUserId = doctorProfile.userId;

    return this.prisma.$transaction(async (tx) => {
      // Atomically claim the slot: only succeeds while still AVAILABLE.
      const claimed = await tx.availability.updateMany({
        where: { id: slot.id, status: SlotStatus.AVAILABLE },
        data: { status: SlotStatus.BOOKED },
      });
      if (claimed.count === 0) {
        throw new ConflictException('Slot was booked by another request');
      }

      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: doctorUserId,
          availabilityId: slot.id,
          startAt: slot.startAt,
          endAt: slot.endAt,
          symptoms: dto.symptoms,
        },
      });

      await tx.consultation.create({
        data: { appointmentId: appointment.id },
      });

      await tx.notification.createMany({
        data: [
          {
            userId: patientId,
            type: 'BOOKING',
            title: 'Booking confirmed',
            message: `Your consultation is booked for ${slot.startAt.toISOString()}`,
          },
          {
            userId: doctorUserId,
            type: 'BOOKING',
            title: 'New booking',
            message: `A patient booked a consultation for ${slot.startAt.toISOString()}`,
          },
        ],
      });

      return appointment;
    });
  }

  async reschedule(patientId: string, appointmentId: string, dto: RescheduleAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment || appointment.patientId !== patientId) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException('Only scheduled appointments can be rescheduled');
    }
    const newSlot = await this.prisma.availability.findUnique({
      where: { id: dto.availabilityId },
    });
    if (!newSlot || newSlot.status !== SlotStatus.AVAILABLE) {
      throw new ConflictException('New slot is not available');
    }
    // The new slot must belong to the same doctor.
    const newSlotDoctor = await this.prisma.doctorProfile.findUnique({
      where: { id: newSlot.doctorId },
    });
    if (!newSlotDoctor || newSlotDoctor.userId !== appointment.doctorId) {
      throw new BadRequestException('New slot belongs to a different doctor');
    }

    return this.prisma.$transaction(async (tx) => {
      const claimed = await tx.availability.updateMany({
        where: { id: newSlot.id, status: SlotStatus.AVAILABLE },
        data: { status: SlotStatus.BOOKED },
      });
      if (claimed.count === 0) {
        throw new ConflictException('New slot was booked by another request');
      }

      if (appointment.availabilityId) {
        await tx.availability.update({
          where: { id: appointment.availabilityId },
          data: { status: SlotStatus.AVAILABLE },
        });
      }

      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          availabilityId: newSlot.id,
          startAt: newSlot.startAt,
          endAt: newSlot.endAt,
        },
      });

      await tx.notification.create({
        data: {
          userId: appointment.doctorId,
          type: 'SCHEDULE_CHANGE',
          title: 'Appointment rescheduled',
          message: `An appointment was rescheduled to ${newSlot.startAt.toISOString()}`,
        },
      });

      return updated;
    });
  }

  async cancel(patientId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment || appointment.patientId !== patientId) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException('Only scheduled appointments can be cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      if (appointment.availabilityId) {
        await tx.availability.update({
          where: { id: appointment.availabilityId },
          data: { status: SlotStatus.AVAILABLE },
        });
      }
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CANCELLED },
      });
      await tx.notification.create({
        data: {
          userId: appointment.doctorId,
          type: 'CANCELLATION',
          title: 'Appointment cancelled',
          message: `An appointment for ${appointment.startAt.toISOString()} was cancelled`,
        },
      });
      return updated;
    });
  }

  async getById(userId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: { include: { doctorProfile: true } },
        patient: { include: { patientProfile: true } },
        consultation: true,
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.patientId !== userId && appointment.doctorId !== userId) {
      throw new ForbiddenException('Not authorized to view this appointment');
    }
    return appointment;
  }
}
