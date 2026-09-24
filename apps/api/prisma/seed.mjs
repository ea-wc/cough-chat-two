import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SPECIALIZATIONS = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Psychiatry',
  'Orthopedics',
  'Endocrinology',
];

const DOCTORS = [
  { firstName: 'Amelia', lastName: 'Hart', specialization: 'General Practice' },
  { firstName: 'Noah', lastName: 'Reed', specialization: 'Cardiology' },
  { firstName: 'Priya', lastName: 'Sharma', specialization: 'Dermatology' },
  { firstName: 'Liam', lastName: 'Okafor', specialization: 'Pediatrics' },
  { firstName: 'Sofia', lastName: 'Nguyen', specialization: 'Psychiatry' },
  { firstName: 'Ethan', lastName: 'Brooks', specialization: 'Orthopedics' },
  { firstName: 'Maya', lastName: 'Castillo', specialization: 'Endocrinology' },
];

function futureSlots() {
  const slots = [];
  const now = new Date();
  for (let day = 1; day <= 7; day += 1) {
    for (const hour of [9, 11, 14, 16]) {
      const start = new Date(now);
      start.setDate(now.getDate() + day);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      slots.push({ startAt: start, endAt: end });
    }
  }
  return slots;
}

async function main() {
  // Pre-provisioned admin (no public registration path).
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@telehealth.dev' },
    update: {},
    create: {
      email: 'admin@telehealth.dev',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Admin ready: ${admin.email}`);

  const slots = futureSlots();

  for (let i = 0; i < DOCTORS.length; i += 1) {
    const d = DOCTORS[i];
    const email = `doctor${i + 1}@telehealth.dev`;
    const passwordHash = await bcrypt.hash('Doctor123!', 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash, role: 'DOCTOR' },
    });

    const profile = await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        firstName: d.firstName,
        lastName: d.lastName,
        specialization: d.specialization,
        bio: `${d.firstName} ${d.lastName} is a ${d.specialization.toLowerCase()} specialist with a focus on patient-centered care.`,
        approvalStatus: 'APPROVED',
      },
    });

    const existing = await prisma.availability.count({ where: { doctorId: profile.id } });
    if (existing === 0) {
      await prisma.availability.createMany({
        data: slots.slice(i, i + 6).map((s) => ({ doctorId: profile.id, ...s })),
      });
    }
    console.log(`Doctor ready: ${d.firstName} ${d.lastName} (${d.specialization})`);
  }

  // A demo patient for convenience.
  const patientEmail = 'patient@telehealth.dev';
  const patientPassword = await bcrypt.hash('Patient123!', 10);
  const patientUser = await prisma.user.upsert({
    where: { email: patientEmail },
    update: {},
    create: { email: patientEmail, passwordHash: patientPassword, role: 'PATIENT' },
  });
  await prisma.patientProfile.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      firstName: 'Demo',
      lastName: 'Patient',
    },
  });
  console.log(`Patient ready: ${patientEmail}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
