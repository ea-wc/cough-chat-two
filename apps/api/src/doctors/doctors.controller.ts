import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, Roles } from '../auth/auth.decorators.js';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { MatchDto } from './dto/match.dto.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';
import { DoctorsService } from './doctors.service.js';
import { MatchingService } from './matching.service.js';

@Controller('doctors/me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
@ApiTags('doctors')
@ApiBearerAuth()
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  getMe(@CurrentUser() user: AuthUser) {
    return this.doctorsService.getMe(user.id);
  }

  @Patch()
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.updateMe(user.id, dto);
  }

  @Get('availability')
  listAvailability(@CurrentUser() user: AuthUser) {
    return this.doctorsService.listAvailability(user.id);
  }

  @Post('availability')
  createAvailability(@CurrentUser() user: AuthUser, @Body() dto: CreateAvailabilityDto) {
    return this.doctorsService.createAvailability(user.id, dto);
  }

  @Delete('availability/:id')
  deleteAvailability(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.doctorsService.deleteAvailability(user.id, id);
  }

  @Get('appointments')
  myAppointments(@CurrentUser() user: AuthUser) {
    return this.doctorsService.myAppointments(user.id);
  }
}

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT)
@ApiTags('doctors')
@ApiBearerAuth()
export class DoctorDiscoveryController {
  constructor(private readonly doctorsService: DoctorsService, private readonly matching: MatchingService) {}

  @Get()
  listDoctors() {
    return this.doctorsService.listDoctors();
  }

  @Get('search')
  searchDoctors(@Query('q') q?: string) {
    return this.doctorsService.searchDoctors(q);
  }

  @Post('match')
  match(@Body() dto: MatchDto) {
    return this.matching.matchDoctors(dto.symptoms ?? [], dto.description);
  }

  @Get(':id')
  getDoctor(@Param('id') id: string) {
    return this.doctorsService.getDoctor(id);
  }
}
