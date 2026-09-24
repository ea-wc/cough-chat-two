import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// Deterministic symptom/concern -> specialty mapping, stored in the application.
const SYMPTOM_TO_SPECIALTY: Record<string, string[]> = {
  'chest pain': ['Cardiology'],
  palpitations: ['Cardiology'],
  'heart': ['Cardiology'],
  'shortness of breath': ['Cardiology', 'General Practice'],
  'skin': ['Dermatology'],
  'rash': ['Dermatology'],
  'acne': ['Dermatology'],
  'eczema': ['Dermatology'],
  'hair': ['Dermatology'],
  'child': ['Pediatrics'],
  'children': ['Pediatrics'],
  'infant': ['Pediatrics'],
  'fever': ['General Practice', 'Pediatrics'],
  'cough': ['General Practice', 'Pediatrics'],
  'flu': ['General Practice'],
  'cold': ['General Practice'],
  'anxiety': ['Psychiatry'],
  'depression': ['Psychiatry'],
  'stress': ['Psychiatry'],
  'sleep': ['Psychiatry'],
  'mood': ['Psychiatry'],
  'joint': ['Orthopedics'],
  'back': ['Orthopedics'],
  'bone': ['Orthopedics'],
  'fracture': ['Orthopedics'],
  'diabetes': ['Endocrinology'],
  'thyroid': ['Endocrinology'],
  'hormone': ['Endocrinology'],
  'weight': ['Endocrinology'],
  'checkup': ['General Practice'],
};

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Map free-form symptoms/description to specialties using deterministic keyword rules.
   * No external AI or directory service is called.
   */
  resolveSpecialties(symptoms: string[], description?: string): string[] {
    const text = [...symptoms, description ?? ''].join(' ').toLowerCase();
    const specialties = new Set<string>();
    for (const [keyword, specs] of Object.entries(SYMPTOM_TO_SPECIALTY)) {
      if (text.includes(keyword)) {
        for (const s of specs) {
          specialties.add(s);
        }
      }
    }
    return [...specialties];
  }

  async matchDoctors(symptoms: string[], description?: string) {
    const specialties = this.resolveSpecialties(symptoms, description);

    const doctors = await this.prisma.doctorProfile.findMany({
      where: {
        approvalStatus: 'APPROVED',
        ...(specialties.length > 0 ? { specialization: { in: specialties } } : {}),
      },
      include: {
        user: { select: { id: true, email: true } },
        availabilities: {
          where: { status: 'AVAILABLE', startAt: { gt: new Date() } },
          orderBy: { startAt: 'asc' },
        },
      },
    });

    // Rank: exact specialty matches first, then doctors with availability.
    const ranked = doctors
      .map((d) => {
        const specialtyHits = specialties.filter((s) => s === d.specialization).length;
        return {
          ...d,
          matchScore: specialtyHits,
          nextAvailability: d.availabilities[0]?.startAt ?? null,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore || (a.nextAvailability?.getTime() ?? Infinity) - (b.nextAvailability?.getTime() ?? Infinity));

    return { specialties, doctors: ranked };
  }
}
