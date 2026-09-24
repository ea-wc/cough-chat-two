import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotesDto, PrescriptionDto, UpdateStateDto } from './dto/consultation.dto.js';

@Injectable()
export class ConsultationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async loadOrThrow(userId: string, consultationId: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        appointment: true,
        prescriptions: true,
      },
    });
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }
    const { patientId, doctorId } = consultation.appointment;
    if (userId !== patientId && userId !== doctorId) {
      throw new ForbiddenException('Not authorized to access this consultation');
    }
    return consultation;
  }

  async getWorkspace(userId: string, consultationId: string) {
    const consultation = await this.loadOrThrow(userId, consultationId);
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: consultation.appointmentId },
      include: {
        doctor: { include: { doctorProfile: true } },
        patient: { include: { patientProfile: true } },
      },
    });
    return { ...consultation, appointment };
  }

  async updateState(userId: string, consultationId: string, dto: UpdateStateDto) {
    const consultation = await this.loadOrThrow(userId, consultationId);
    if (userId !== consultation.appointment.doctorId) {
      throw new ForbiddenException('Only the doctor can update consultation state');
    }
    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        state: dto.state,
        ...(dto.state === 'COMPLETED' && { endedAt: new Date() }),
        ...(dto.state === 'IN_PROGRESS' && !consultation.startedAt && { startedAt: new Date() }),
      },
    });
  }

  async recordNotes(userId: string, consultationId: string, dto: NotesDto) {
    const consultation = await this.loadOrThrow(userId, consultationId);
    if (userId !== consultation.appointment.doctorId) {
      throw new ForbiddenException('Only the doctor can record notes');
    }
    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: { notes: dto.notes, ...(dto.summary !== undefined && { summary: dto.summary }) },
    });
  }

  async addPrescription(userId: string, consultationId: string, dto: PrescriptionDto) {
    const consultation = await this.loadOrThrow(userId, consultationId);
    if (userId !== consultation.appointment.doctorId) {
      throw new ForbiddenException('Only the doctor can add prescriptions');
    }
    return this.prisma.prescription.create({
      data: {
        consultationId,
        patientId: consultation.appointment.patientId,
        doctorId: consultation.appointment.doctorId,
        medication: dto.medication,
        dosage: dto.dosage,
        instructions: dto.instructions,
      },
    });
  }
}
