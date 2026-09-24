import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, type: NotificationType, title: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, type, title, message },
    });
  }

  createMany(userIds: string[], type: NotificationType, title: string, message: string) {
    return this.prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, type, title, message })),
    });
  }

  async listForUser(userId: string) {
    const stored = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Synthesize "upcoming appointment" notifications from the next 24h.
    const now = new Date();
    const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcoming = await this.prisma.appointment.findMany({
      where: {
        OR: [{ patientId: userId }, { doctorId: userId }],
        status: 'SCHEDULED',
        startAt: { gt: now, lte: soon },
      },
      orderBy: { startAt: 'asc' },
      include: { doctor: { include: { doctorProfile: true } } },
    });

    const upcomingNotifications = upcoming.map((a) => ({
      id: `upcoming-${a.id}`,
      type: 'UPCOMING' as NotificationType,
      title: 'Upcoming appointment',
      message: `Consultation with ${a.doctor.doctorProfile?.firstName ?? 'your doctor'} at ${a.startAt.toISOString()}`,
      read: false,
      createdAt: a.createdAt,
    }));

    return [...upcomingNotifications, ...stored];
  }

  async markRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
