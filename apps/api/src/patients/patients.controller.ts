import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, Roles } from '../auth/auth.decorators.js';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { PatientsService } from './patients.service.js';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT)
@ApiTags('patients')
@ApiBearerAuth()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.patientsService.getMe(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdatePatientDto) {
    return this.patientsService.updateMe(user.id, dto);
  }

  @Get('me/appointments')
  myAppointments(@CurrentUser() user: AuthUser) {
    return this.patientsService.myAppointments(user.id);
  }

  @Get('me/prescriptions')
  myPrescriptions(@CurrentUser() user: AuthUser) {
    return this.patientsService.myPrescriptions(user.id);
  }
}
