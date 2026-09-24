import { Module } from '@nestjs/common';
import {
  DoctorDiscoveryController,
  DoctorsController,
} from './doctors.controller.js';
import { DoctorsService } from './doctors.service.js';
import { MatchingService } from './matching.service.js';

@Module({
  controllers: [DoctorsController, DoctorDiscoveryController],
  providers: [DoctorsService, MatchingService],
})
export class DoctorsModule {}
