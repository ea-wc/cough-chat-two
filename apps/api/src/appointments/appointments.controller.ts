import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser, Roles } from '../auth/auth.decorators.js';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { AppointmentsService } from './appointments.service.js';
import { BookAppointmentDto } from './dto/book-appointment.dto.js';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto.js';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.PATIENT)
  book(@CurrentUser() user: AuthUser, @Body() dto: BookAppointmentDto) {
    return this.appointmentsService.book(user.id, dto);
  }

  @Post(':id/reschedule')
  @Roles(Role.PATIENT)
  reschedule(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    return this.appointmentsService.reschedule(user.id, id, dto);
  }

  @Post(':id/cancel')
  @Roles(Role.PATIENT)
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.appointmentsService.cancel(user.id, id);
  }

  @Get(':id')
  @Roles(Role.PATIENT, Role.DOCTOR)
  getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.appointmentsService.getById(user.id, id);
  }
}
