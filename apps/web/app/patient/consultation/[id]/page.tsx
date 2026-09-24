'use client';

import { use } from 'react';
import ConsultationWorkspace from '../../../components/ConsultationWorkspace';

export default function PatientConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ConsultationWorkspace id={id} />;
}
