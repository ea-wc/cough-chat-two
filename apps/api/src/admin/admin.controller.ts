import {
  Body,
  Controller,
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
import { AdminService } from './admin.service.js';
import { ReviewDoctorDto, UpdateUserStatusDto } from './dto/admin.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  searchUsers(@Query('q') q?: string) {
    return this.adminService.searchUsers(q);
  }

  @Patch('users/:id')
  updateUserStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(user.id, id, dto);
  }

  @Get('doctors')
  listDoctors() {
    return this.adminService.listDoctors();
  }

  @Patch('doctors/:id')
  reviewDoctor(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ReviewDoctorDto,
  ) {
    return this.adminService.reviewDoctor(user.id, id, dto);
  }

  @Get('appointments')
  listAppointments() {
    return this.adminService.listAppointments();
  }

  @Post('appointments/:id/cancel')
  cancelAppointment(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.adminService.cancelAppointment(user.id, id);
  }

  @Get('dashboard')
  dashboard() {
    return this.adminService.dashboard();
  }

  @Get('audit')
  auditLog() {
    return this.adminService.auditLog();
  }
}
