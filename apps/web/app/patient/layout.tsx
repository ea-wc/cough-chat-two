import Guarded from '../components/Guarded';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <Guarded roles={['PATIENT']}>{children}</Guarded>;
}
