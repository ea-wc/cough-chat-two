import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, Roles } from '../auth/auth.decorators.js';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { ConsultationsService } from './consultations.service.js';
import { NotesDto, PrescriptionDto, UpdateStateDto } from './dto/consultation.dto.js';

@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('consultations')
@ApiBearerAuth()
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get(':id')
  @Roles(Role.PATIENT, Role.DOCTOR)
  getWorkspace(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.consultationsService.getWorkspace(user.id, id);
  }

  @Post(':id/state')
  @Roles(Role.DOCTOR)
  updateState(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateStateDto) {
    return this.consultationsService.updateState(user.id, id, dto);
  }

  @Post(':id/notes')
  @Roles(Role.DOCTOR)
  recordNotes(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: NotesDto) {
    return this.consultationsService.recordNotes(user.id, id, dto);
  }

  @Post(':id/prescriptions')
  @Roles(Role.DOCTOR)
  addPrescription(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: PrescriptionDto) {
    return this.consultationsService.addPrescription(user.id, id, dto);
  }
}
